import React, { useRef, useMemo, useCallback, useState, KeyboardEvent } from 'react';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useCombobox, UseMultipleSelectionProps } from 'downshift';
import { NativeSelect } from '../native-select';
import { BaseSelectProps, BaseOptionProps, OptionShape } from '../../typings';

import styles from './index.module.css';
import { isGroup } from '../../utils';

export const BaseSelect = ({
    className,
    options,
    autocomplete = false,
    multiple = false,
    allowUnselect = false,
    disabled = false,
    closeOnSelect = !multiple,
    circularNavigation = false,
    nativeSelect = false,
    popoverOffset = 4,
    name,
    selected,
    size = 's',
    block,
    label,
    placeholder,
    onChange,
    onOpen,
    Arrow = () => null,
    Field = () => null,
    OptionsList = () => null,
    Optgroup = () => null,
    Option = () => null,
}: BaseSelectProps) => {
    const [focused, setFocused] = useState(false);

    const optionsListRef = useRef<HTMLElement>(null);
    const fieldRef = useRef<HTMLInputElement>(null);

    const getPortalContainer = () => optionsListRef.current as HTMLDivElement;

    const getPopoverOffset = useMemo((): [number, number] => [0, popoverOffset], [popoverOffset]);

    const itemToString = (option: OptionShape) => (option ? option.text || option.value : '');

    const flatOptions = useMemo(
        () =>
            options.reduce(
                (acc: OptionShape[], option) =>
                    acc.concat(isGroup(option) ? option.options : option),
                [],
            ),
        [options],
    );

    const useMultipleSelectionProps: UseMultipleSelectionProps<OptionShape> = {
        itemToString,
        onSelectedItemsChange: changes => {
            if (onChange) {
                const { selectedItems } = changes;

                let value;
                if (selectedItems) {
                    value = selectedItems.map(item => item.value);
                    // eslint-disable-next-line prefer-destructuring
                    if (!multiple) value = value[0];
                }

                /**
                 * https://github.com/alfa-laboratory/core-components/issues/45
                 *
                 * TODO: Если события нет, нужно ли сохранять сигнатуру?
                 */
                onChange(undefined, {
                    selected: multiple ? selectedItems : (selectedItems || [])[0],
                    value,
                    name,
                });
            }
        },
    };

    if (selected) {
        useMultipleSelectionProps.selectedItems = Array.isArray(selected) ? selected : [selected];
    }

    const {
        selectedItems,
        addSelectedItem,
        setSelectedItems,
        removeSelectedItem,
        getDropdownProps,
    } = useMultipleSelection(useMultipleSelectionProps);

    const {
        isOpen: open,
        getToggleButtonProps,
        getMenuProps,
        getInputProps,
        getItemProps,
        getComboboxProps,
        highlightedIndex,
        toggleMenu,
    } = useCombobox<OptionShape>({
        circularNavigation,
        items: flatOptions,
        itemToString,
        onIsOpenChange: changes => {
            if (onOpen) {
                onOpen({
                    open: changes.isOpen,
                    name,
                });
            }
        },
        stateReducer: (state, actionAndChanges) => {
            const { type, changes } = actionAndChanges;
            const { selectedItem } = changes;

            switch (type) {
                case useCombobox.stateChangeTypes.InputKeyDownEnter:
                case useCombobox.stateChangeTypes.ItemClick:
                    if (selectedItem && !selectedItem.disabled) {
                        const alreadySelected = selectedItems.includes(selectedItem);
                        const allowRemove = allowUnselect || (multiple && selectedItems.length > 1);

                        if (alreadySelected && allowRemove) {
                            removeSelectedItem(selectedItem);
                        }

                        if (!alreadySelected) {
                            if (multiple) {
                                addSelectedItem(selectedItem);
                            } else {
                                setSelectedItems([selectedItem]);
                            }
                        }
                    }

                    return {
                        ...changes,
                        isOpen: !closeOnSelect,
                        // при closeOnSelect === false - сохраняем подсвеченный индекс
                        highlightedIndex:
                            state.isOpen && !closeOnSelect
                                ? state.highlightedIndex
                                : changes.highlightedIndex,
                    };
                default:
                    return changes;
            }
        },
    });

    const menuProps = getMenuProps(nativeSelect ? {} : { ref: optionsListRef });

    const handleNativeSelectChange = useCallback(
        event => {
            const selectedOptions = [...event.target.options].reduce(
                (acc, option, index) => (option.selected ? acc.concat(flatOptions[index]) : acc),
                [],
            );

            setSelectedItems(selectedOptions);
        },
        [flatOptions, setSelectedItems],
    );

    const handleToggleButtonKeyDown = useCallback(
        event => {
            if (!nativeSelect && [' ', 'Enter'].includes(event.key)) {
                if (!open) {
                    toggleMenu();
                    if (fieldRef.current) fieldRef.current.focus();
                }
            }
        },
        [nativeSelect, open, toggleMenu],
    );

    const handleFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setFocused(false);
    }, []);

    const WrappedOption = useCallback(
        ({ option, index, ...rest }: Pick<BaseOptionProps, 'option' | 'index'>) => (
            <div
                {...getItemProps({ index, item: option, disabled: option.disabled })}
                key={option.value}
            >
                {Option({
                    ...rest,
                    option,
                    index,
                    size,
                    disabled: option.disabled,
                    highlighted: index === highlightedIndex,
                    selected: selectedItems.includes(option),
                })}
            </div>
        ),
        [getItemProps, highlightedIndex, Option, selectedItems, size],
    );

    const renderValue = useCallback(
        () =>
            selectedItems.map(option => (
                <input type='hidden' name={name} value={option.value} key={option.value} />
            )),
        [selectedItems, name],
    );

    const renderNativeSelect = useCallback(() => {
        const value = multiple
            ? selectedItems.map(option => option.value)
            : (selectedItems[0] || {}).value;

        return (
            <NativeSelect
                {...menuProps}
                className={styles.nativeSelect}
                disabled={disabled}
                multiple={multiple}
                name={name}
                value={value}
                onChange={handleNativeSelectChange}
                options={options}
            />
        );
    }, [multiple, selectedItems, disabled, name, handleNativeSelectChange, options, menuProps]);

    const renderField = () => {
        const inputProps = getInputProps(getDropdownProps({ ref: fieldRef }));

        const fieldWrapperProps = {
            className: styles.fieldWrapper,
            role: 'button',
            tabIndex: nativeSelect ? -1 : 0,
            ref: autocomplete ? null : inputProps.ref,
            disabled: disabled || (autocomplete && open),
            onBlur: handleBlur,
            onFocus: handleFocus,
            onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
                handleToggleButtonKeyDown(event);
                if (!autocomplete) {
                    inputProps.onKeyDown(event);
                }
            },
        };

        const fieldProps = autocomplete ? inputProps : {};

        return (
            <div {...getToggleButtonProps(fieldWrapperProps)}>
                {nativeSelect && renderNativeSelect()}

                {Field({
                    selected: selectedItems,
                    multiple,
                    open,
                    disabled,
                    size,
                    placeholder,
                    block,
                    label,
                    Arrow: Arrow({ open }),
                    filled: selectedItems.length > 0,
                    focused,
                    ...fieldProps,
                })}
            </div>
        );
    };

    return (
        <div
            {...getComboboxProps({
                className: cn(styles.component, { [styles.block]: block }, className),
            })}
        >
            {renderField()}

            {name && !nativeSelect && renderValue()}

            {!nativeSelect && (
                <div {...menuProps} className={styles.listWrapper}>
                    <Popover
                        open={open}
                        withTransition={false}
                        anchorElement={optionsListRef.current as HTMLElement}
                        position='bottom-start'
                        getPortalContainer={getPortalContainer}
                        popperClassName={styles.popover}
                        offset={getPopoverOffset}
                    >
                        {OptionsList({
                            flatOptions,
                            highlightedIndex,
                            open,
                            options,
                            Optgroup,
                            children: WrappedOption,
                        })}
                    </Popover>
                </div>
            )}
        </div>
    );
};
