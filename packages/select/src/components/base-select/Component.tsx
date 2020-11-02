import React, {
    useRef,
    useMemo,
    useCallback,
    MouseEvent,
    forwardRef,
    KeyboardEvent,
    FocusEvent,
} from 'react';
import mergeRefs from 'react-merge-refs';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useCombobox, UseMultipleSelectionProps } from 'downshift';
import { NativeSelect } from '../native-select';
import { BaseSelectProps, OptionShape } from '../../typings';

import styles from './index.module.css';
import { isGroup } from '../../utils';

export const BaseSelect = forwardRef(
    (
        {
            dataTestId,
            className,
            options,
            autocomplete = false,
            multiple = false,
            allowUnselect = false,
            disabled = false,
            closeOnSelect = !multiple,
            circularNavigation = false,
            nativeSelect = false,
            name,
            id,
            selected,
            size = 's',
            error,
            hint,
            block,
            label,
            placeholder,
            fieldProps = {},
            valueRenderer,
            onChange,
            onOpen,
            onFocus,
            onBlur,
            Arrow,
            Field = () => null,
            OptionsList = () => null,
            Optgroup = () => null,
            Option = () => null,
        }: BaseSelectProps,
        ref,
    ) => {
        const optionsListRef = useRef<HTMLElement>(null);
        const fieldRef = useRef<HTMLInputElement>(null);

        const getPortalContainer = () => optionsListRef.current as HTMLDivElement;

        const itemToString = (option: OptionShape) => (option ? option.key : '');

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
                        selectedMultiple: selectedItems,
                        selected: selectedItems.length ? selectedItems[0] : null,
                        name,
                    });
                }
            },
        };

        if (selected !== undefined) {
            useMultipleSelectionProps.selectedItems = flatOptions.filter(option =>
                Array.isArray(selected) ? selected.includes(option.key) : selected === option.key,
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
            getMenuProps,
            getInputProps,
            getItemProps,
            getComboboxProps,
            getLabelProps,
            highlightedIndex,
            toggleMenu,
            openMenu,
        } = useCombobox<OptionShape>({
            id,
            circularNavigation,
            items: flatOptions,
            itemToString,
            defaultHighlightedIndex: selectedItems.length === 0 ? 0 : undefined,
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
                            const allowRemove =
                                allowUnselect || (multiple && selectedItems.length > 1);

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
        const inputProps = getInputProps(getDropdownProps({ ref: mergeRefs([ref, fieldRef]) }));

        const handleFieldFocus = (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => {
            if (onFocus) onFocus(event);

            if (autocomplete && !open) {
                openMenu();
            }
        };

        const handleFieldBlur = (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => {
            if (onBlur) onBlur(event);

            inputProps.onBlur(event);
        };

        const handleFieldKeyDown = (event: KeyboardEvent<HTMLDivElement | HTMLInputElement>) => {
            inputProps.onKeyDown(event);

            if (autocomplete && !open && event.key.length === 1) {
                // Для автокомплита - открываем меню при начале ввода
                openMenu();
            }

            if ([' ', 'Enter'].includes(event.key) && !autocomplete && !nativeSelect) {
                // Открываем\закрываем меню по нажатию enter или пробела
                event.preventDefault();
                if (!open || highlightedIndex === -1) toggleMenu();
            }
        };

        const handleFieldClick = () => {
            toggleMenu();
        };

        const handleNativeSelectChange = useCallback(
            event => {
                const selectedOptions = [...event.target.options].reduce(
                    (acc, option, index) =>
                        option.selected ? acc.concat(flatOptions[index]) : acc,
                    [],
                );

                setSelectedItems(selectedOptions);
            },
            [flatOptions, setSelectedItems],
        );

        const WrappedOption = useCallback(
            ({ option, index, ...rest }: { option: OptionShape; index: number }) => (
                <Option
                    {...rest}
                    {...getItemProps({
                        index,
                        item: option,
                        disabled: option.disabled,
                    })}
                    key={option.key}
                    index={index}
                    option={option}
                    size={size}
                    disabled={option.disabled}
                    highlighted={index === highlightedIndex}
                    selected={selectedItems.includes(option)}
                    onMouseDown={(event: MouseEvent) => event.preventDefault()}
                />
            ),
            [getItemProps, highlightedIndex, selectedItems, size],
        );

        const renderValue = useCallback(
            () =>
                selectedItems.map(option => (
                    <input type='hidden' name={name} value={option.key} key={option.key} />
                )),
            [selectedItems, name],
        );

        const renderNativeSelect = useCallback(() => {
            const value = multiple
                ? selectedItems.map(option => option.key)
                : (selectedItems[0] || {}).key;

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
                data-test-id={dataTestId}
            >
                {nativeSelect && renderNativeSelect()}

                <Field
                    selectedMultiple={selectedItems}
                    selected={selectedItems[0]}
                    multiple={multiple}
                    open={open}
                    disabled={disabled}
                    size={size}
                    placeholder={placeholder}
                    label={label && <span {...getLabelProps()}>{label}</span>}
                    Arrow={Arrow && <Arrow open={open} />}
                    error={error}
                    hint={hint}
                    valueRenderer={valueRenderer}
                    innerProps={{
                        onBlur: handleFieldBlur,
                        onFocus: disabled ? undefined : handleFieldFocus,
                        onKeyDown: disabled ? undefined : handleFieldKeyDown,
                        onClick: disabled ? undefined : handleFieldClick,
                        tabIndex: nativeSelect || disabled ? -1 : 0,
                        ref: mergeRefs([inputProps.ref]),
                        id: inputProps.id,
                        'aria-labelledby': inputProps['aria-labelledby'],
                        'aria-controls': inputProps['aria-controls'],
                        'aria-autocomplete': autocomplete
                            ? inputProps['aria-autocomplete']
                            : undefined,
                    }}
                    {...fieldProps}
                />

                {name && !nativeSelect && renderValue()}

                {!nativeSelect && (
                    <div {...menuProps} className={styles.listWrapper}>
                        <Popover
                            open={open}
                            withTransition={false}
                            anchorElement={fieldRef.current as HTMLElement}
                            position='bottom-start'
                            getPortalContainer={getPortalContainer}
                            popperClassName={styles.popover}
                        >
                            <OptionsList
                                flatOptions={flatOptions}
                                highlightedIndex={highlightedIndex}
                                open={open}
                                size={size}
                                options={options}
                                Optgroup={Optgroup}
                                Option={WrappedOption}
                            />
                        </Popover>
                    </div>
                )}
            </div>
        );
    },
);
