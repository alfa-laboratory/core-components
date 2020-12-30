import React, {
    useRef,
    useMemo,
    useCallback,
    MouseEvent,
    forwardRef,
    KeyboardEvent,
    FocusEvent,
    useEffect,
} from 'react';
import mergeRefs from 'react-merge-refs';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import {
    useMultipleSelection,
    useCombobox,
    UseMultipleSelectionProps,
    UseMultipleSelectionState,
} from 'downshift';
import { NativeSelect } from '../native-select';
import { BaseSelectProps, OptionShape } from '../../typings';
import { processOptions } from '../../utils';

import styles from './index.module.css';

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
            defaultOpen = false,
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
            optionsListProps = {},
            optionProps = {},
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
            updatePopover,
            showEmptyOptionsList = false,
        }: BaseSelectProps,
        ref,
    ) => {
        const optionsListRef = useRef<HTMLElement>(null);
        const fieldRef = useRef<HTMLInputElement>(null);

        const getPortalContainer = () => optionsListRef.current as HTMLDivElement;

        const itemToString = (option: OptionShape) => (option ? option.key : '');

        const { flatOptions, selectedOptions } = useMemo(() => processOptions(options, selected), [
            options,
            selected,
        ]);

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
            stateReducer: (state, actionAndChanges) => {
                const { type, changes } = actionAndChanges;

                if (
                    !allowUnselect &&
                    type === useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace
                ) {
                    return state;
                }

                return changes as UseMultipleSelectionState<OptionShape>;
            },
        };

        if (selected !== undefined) {
            useMultipleSelectionProps.selectedItems = selectedOptions;
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
            if (!autocomplete || !open) {
                toggleMenu();
            }
        };

        const handleNativeSelectChange = useCallback(
            event => {
                setSelectedItems(
                    [...event.target.options].reduce(
                        (acc, option, index) =>
                            option.selected ? acc.concat(flatOptions[index]) : acc,
                        [],
                    ),
                );
            },
            [flatOptions, setSelectedItems],
        );

        const WrappedOption = useCallback(
            ({ option, index, ...rest }: { option: OptionShape; index: number }) => (
                <React.Fragment key={option.key}>
                    {Option({
                        ...(optionProps as object),
                        ...rest,
                        innerProps: getItemProps({
                            index,
                            item: option,
                            disabled: option.disabled,
                            onMouseDown: (event: MouseEvent) => event.preventDefault(),
                        }),
                        index,
                        option,
                        size,
                        disabled: option.disabled,
                        highlighted: index === highlightedIndex,
                        selected: selectedItems.includes(option),
                    })}
                </React.Fragment>
            ),
            [Option, getItemProps, highlightedIndex, optionProps, selectedItems, size],
        );

        useEffect(() => {
            if (defaultOpen) openMenu();
        }, [defaultOpen, openMenu]);

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

        const needRenderOptionsList = flatOptions.length > 0 || showEmptyOptionsList;

        return (
            <div
                {...getComboboxProps({
                    className: cn(styles.component, { [styles.block]: block }, className),
                })}
                onKeyDown={disabled ? undefined : handleFieldKeyDown}
                tabIndex={-1}
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
                            preventFlip={true}
                            getPortalContainer={getPortalContainer}
                            popperClassName={styles.popover}
                            update={updatePopover}
                        >
                            {needRenderOptionsList && (
                                <div className={styles.optionsList}>
                                    <OptionsList
                                        {...optionsListProps}
                                        flatOptions={flatOptions}
                                        highlightedIndex={highlightedIndex}
                                        open={open}
                                        size={size}
                                        options={options}
                                        Optgroup={Optgroup}
                                        Option={WrappedOption}
                                    />
                                </div>
                            )}
                        </Popover>
                    </div>
                )}
            </div>
        );
    },
);
