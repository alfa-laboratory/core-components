import React, { useRef, useMemo, useCallback, useState } from 'react';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useSelect, UseMultipleSelectionProps } from 'downshift';
import { NativeSelect } from '../native-select';
import { BaseSelectProps, BaseOptionProps, OptionShape } from '../../typings';

import styles from './index.module.css';
import { isGroup } from '../../utils';

export const BaseSelect = ({
    className,
    options,
    multiple = false,
    allowUnselect = false,
    disabled = false,
    closeOnSelect = !multiple,
    circularNavigation = false,
    nativeSelect = false,
    popoverOffset = 4,
    name,
    selected,
    onChange,
    onOpen,
    Field,
    OptionsList,
    Optgroup,
    Option,
}: BaseSelectProps) => {
    const [focused, setFocused] = useState(false);

    const selectRef = useRef<HTMLDivElement>(null);
    const optionsListRef = useRef<HTMLElement>(null);

    const getPortalContainer = () => optionsListRef.current as HTMLDivElement;

    const getPopoverOffset = useMemo((): [number, number] => [0, popoverOffset], [popoverOffset]);

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
        itemToString: item => item.value.toString(),
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
    } = useMultipleSelection(useMultipleSelectionProps);

    const {
        isOpen: open,
        getToggleButtonProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        toggleMenu,
    } = useSelect<OptionShape>({
        circularNavigation,
        items: flatOptions,
        itemToString: item => (item ? item.value.toString() : ''),
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
                case useSelect.stateChangeTypes.MenuKeyDownEnter:
                case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
                case useSelect.stateChangeTypes.ItemClick:
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
                event.preventDefault();
                toggleMenu();
            }
        },
        [nativeSelect, toggleMenu],
    );

    const handleFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setFocused(false);
    }, []);

    const WrappedOption = useCallback(
        ({ option, index, ...rest }: Pick<BaseOptionProps, 'option' | 'index'>) => (
            <Option
                {...rest}
                {...getItemProps({ index, item: option, disabled: option.disabled })}
                key={option.value}
                option={option}
                index={index}
                disabled={option.disabled}
                highlighted={index === highlightedIndex}
                selected={selectedItems.includes(option)}
            />
        ),
        [getItemProps, highlightedIndex, selectedItems],
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
                className={styles.nativeSelect}
                disabled={disabled}
                multiple={multiple}
                name={name}
                value={value}
                onChange={handleNativeSelectChange}
                options={options}
            />
        );
    }, [multiple, selectedItems, disabled, name, handleNativeSelectChange, options]);

    return (
        <div ref={selectRef} className={cn(styles.component, className)}>
            <div
                role='button'
                {...getToggleButtonProps({
                    disabled,
                    onKeyDown: handleToggleButtonKeyDown,
                    onBlur: handleBlur,
                    onFocus: handleFocus,
                })}
                className={styles.fieldWrapper}
                tabIndex={nativeSelect ? -1 : 0}
            >
                {nativeSelect && renderNativeSelect()}
                <Field
                    value={selectedItems}
                    multiple={multiple}
                    open={open}
                    disabled={disabled}
                    filled={selectedItems.length > 0}
                    focused={focused}
                />
            </div>

            {name && !nativeSelect && renderValue()}

            {!nativeSelect && (
                <div {...getMenuProps({ ref: optionsListRef })} className={styles.listWrapper}>
                    <Popover
                        open={open}
                        withTransition={false}
                        anchorElement={optionsListRef.current as HTMLElement}
                        position='bottom-start'
                        getPortalContainer={getPortalContainer}
                        popperClassName={styles.popover}
                        offset={getPopoverOffset}
                    >
                        <OptionsList
                            flatOptions={flatOptions}
                            highlightedIndex={highlightedIndex}
                            multiple={multiple}
                            open={open}
                            options={options}
                            Optgroup={Optgroup}
                        >
                            {WrappedOption}
                        </OptionsList>
                    </Popover>
                </div>
            )}
        </div>
    );
};
