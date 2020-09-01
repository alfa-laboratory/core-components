import React, { useRef, useMemo, useCallback, KeyboardEvent, MouseEvent } from 'react';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useCombobox, UseMultipleSelectionProps } from 'downshift';
import { NativeSelect } from '../native-select';
import { SelectProps, OptionProps, OptionShape } from '../../typings';

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
    fieldProps = {},
    onChange,
    onOpen,
    Arrow,
    Field = () => null,
    OptionsList = () => null,
    Optgroup = () => null,
    Option = () => null,
}: SelectProps) => {
    const optionsListRef = useRef<HTMLElement>(null);
    const fieldRef = useRef<HTMLInputElement>(null);

    const getPortalContainer = () => optionsListRef.current as HTMLDivElement;

    const getPopoverOffset = useMemo((): [number, number] => [0, popoverOffset], [popoverOffset]);

    const itemToString = (option: OptionShape) =>
        option ? option.text || option.value.toString() : '';

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
                const { selectedItems = [] } = changes;

                onChange({
                    selectedOptions: selectedItems,
                    selected: selectedItems.map(item => item.value),
                    name,
                });
            }
        },
    };

    if (selected) {
        useMultipleSelectionProps.selectedItems = flatOptions.filter(option =>
            selected.includes(option.value),
        );
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
        getLabelProps,
        highlightedIndex,
        toggleMenu,
        openMenu,
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
    const inputProps = getInputProps(getDropdownProps({ ref: fieldRef }));
    const toggleButtonProps = getToggleButtonProps();

    const handleFieldWrapperFocus = () => {
        if (autocomplete && !open) {
            openMenu();
        }
    };

    const handleFieldWrapperKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        inputProps.onKeyDown(event);

        if (autocomplete && !open && event.key.length === 1) {
            // Для автокомплита - открываем меню при начале ввода
            openMenu();
        }

        if ([' ', 'Enter'].includes(event.key) && !autocomplete && !nativeSelect) {
            // Открываем\закрываем меню по нажатию enter или пробела
            if (!open || highlightedIndex === -1) toggleMenu();
        }
    };

    const handleFieldWrapperMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        if (!nativeSelect) event.preventDefault();

        toggleMenu();
        if (fieldRef.current) fieldRef.current.focus();
    };

    const fieldWrapperProps = {
        className: styles.fieldWrapper,
        role: 'button',
        ref: toggleButtonProps.ref,
        onBlur: inputProps.onBlur,
        onFocus: disabled ? undefined : handleFieldWrapperFocus,
        onKeyDown: disabled ? undefined : handleFieldWrapperKeyDown,
        onMouseDown: disabled ? undefined : handleFieldWrapperMouseDown,
    };

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

    const WrappedOption = useCallback(
        ({ option, index, ...rest }: Pick<OptionProps, 'option' | 'index'>) => (
            <div
                {...getItemProps({ index, item: option, disabled: option.disabled })}
                key={option.value}
            >
                <Option
                    {...rest}
                    option={option}
                    index={index}
                    size={size}
                    disabled={option.disabled}
                    highlighted={index === highlightedIndex}
                    selected={selectedItems.includes(option)}
                />
            </div>
        ),
        [getItemProps, highlightedIndex, selectedItems, size],
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

    return (
        <div
            {...getComboboxProps({
                className: cn(styles.component, { [styles.block]: block }, className),
            })}
        >
            <div {...fieldWrapperProps}>
                {nativeSelect && renderNativeSelect()}

                <Field
                    selectedItems={selectedItems}
                    multiple={multiple}
                    open={open}
                    disabled={disabled}
                    size={size}
                    placeholder={placeholder}
                    label={label && <span {...getLabelProps()}>{label}</span>}
                    Arrow={Arrow && <Arrow open={open} />}
                    innerProps={{
                        tabIndex: nativeSelect ? -1 : 0,
                        ref: inputProps.ref,
                        id: inputProps.id,
                        'aria-labelledby': inputProps['aria-labelledby'],
                        'aria-controls': inputProps['aria-controls'],
                        'aria-autocomplete': autocomplete
                            ? inputProps['aria-autocomplete']
                            : undefined,
                    }}
                    {...fieldProps}
                />
            </div>

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
                        <OptionsList
                            flatOptions={flatOptions}
                            highlightedIndex={highlightedIndex}
                            open={open}
                            options={options}
                            Optgroup={Optgroup}
                            Option={WrappedOption}
                        />
                    </Popover>
                </div>
            )}
        </div>
    );
};
