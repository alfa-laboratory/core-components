import React, {
    useRef,
    useMemo,
    useCallback,
    MouseEvent,
    forwardRef,
    KeyboardEvent,
    FocusEvent,
    useEffect,
    useLayoutEffect,
} from 'react';
import { ResizeObserver } from 'resize-observer';
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
import { getDataTestId } from '../../../../utils/getDataTestId';

import styles from './index.module.css';

export const BaseSelect = forwardRef(
    (
        {
            dataTestId,
            className,
            fieldClassName,
            optionsListClassName,
            optionClassName,
            popperClassName,
            options,
            autocomplete = false,
            multiple = false,
            allowUnselect = false,
            disabled = false,
            closeOnSelect = !multiple,
            circularNavigation = false,
            nativeSelect = false,
            defaultOpen = false,
            open: openProp,
            popoverPosition = 'bottom-start',
            preventFlip = true,
            optionsListWidth = 'content',
            name,
            id,
            selected,
            size = 's',
            optionsSize = size,
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
            onScroll,
            Arrow,
            Field = () => null,
            OptionsList = () => null,
            Optgroup = () => null,
            Option = () => null,
            updatePopover,
            zIndexPopover,
            showEmptyOptionsList = false,
            visibleOptions,
        }: BaseSelectProps,
        ref,
    ) => {
        const rootRef = useRef<HTMLLabelElement>(null);
        const fieldRef = useRef<HTMLInputElement>(null);
        const listRef = useRef<HTMLDivElement>(null);
        const initiatorRef = useRef<OptionShape | null>(null);

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
                        initiator: initiatorRef.current,
                        name,
                    });

                    initiatorRef.current = null;
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
            isOpen: openProp,
            circularNavigation,
            items: flatOptions,
            itemToString,
            defaultHighlightedIndex: selectedItems.length === 0 ? -1 : undefined,
            onIsOpenChange: changes => {
                if (onOpen) {
                    /**
                     *  Вызываем обработчик асинхронно.
                     *
                     * Иначе при клике вне открытого селекта сначала сработает onOpen, который закроет селект,
                     * А затем сработает onClick кнопки открытия\закрытия с open=false и в итоге селект откроется снова.
                     */
                    setTimeout(() => {
                        onOpen({
                            open: changes.isOpen,
                            name,
                        });
                    }, 0);
                }
            },
            stateReducer: (state, actionAndChanges) => {
                const { type, changes } = actionAndChanges;
                const { selectedItem } = changes;

                switch (type) {
                    case useCombobox.stateChangeTypes.InputKeyDownEnter:
                    case useCombobox.stateChangeTypes.ItemClick:
                        initiatorRef.current = selectedItem;

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

        const menuProps = (getMenuProps as (options: object, additional: object) => void)(
            { ref: listRef },
            { suppressRefError: true },
        );
        const inputProps = getInputProps(getDropdownProps({ ref: mergeRefs([ref, fieldRef]) }));

        const handleFieldFocus = (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => {
            if (onFocus) onFocus(event);

            if (autocomplete && !open) {
                openMenu();
            }
        };

        const handleFieldBlur = (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => {
            const isNextFocusInsideList = listRef.current?.contains(
                (event.relatedTarget || document.activeElement) as HTMLElement,
            );

            if (!isNextFocusInsideList) {
                if (onBlur) onBlur(event);

                inputProps.onBlur(event);
            }
        };

        const handleFieldKeyDown = (event: KeyboardEvent<HTMLDivElement | HTMLInputElement>) => {
            inputProps.onKeyDown(event);
            if (autocomplete && !open && (event.key.length === 1 || event.key === 'Backspace')) {
                // Для автокомплита - открываем меню при начале ввода
                openMenu();
            }

            if (
                [' ', 'Enter'].includes(event.key) &&
                !autocomplete &&
                !nativeSelect &&
                (event.target as HTMLElement).tagName !== 'INPUT' &&
                (event.target as HTMLElement).tagName !== 'BUTTON'
            ) {
                // Открываем\закрываем меню по нажатию enter или пробела
                event.preventDefault();
                if (!open || highlightedIndex === -1) toggleMenu();
            }
        };

        const handleFieldClick = (event: MouseEvent) => {
            if (!autocomplete || (event.target as HTMLElement).tagName !== 'INPUT') {
                toggleMenu();
            } else {
                openMenu();
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

        const getOptionProps = useCallback(
            (option: OptionShape, index: number) => ({
                ...(optionProps as object),
                className: optionClassName,
                innerProps: getItemProps({
                    index,
                    item: option,
                    disabled: option.disabled,
                    onMouseDown: (event: MouseEvent) => event.preventDefault(),
                }),
                multiple,
                index,
                option,
                size: optionsSize,
                disabled: option.disabled,
                highlighted: index === highlightedIndex,
                selected: selectedItems.includes(option),
                dataTestId: getDataTestId(dataTestId, 'option'),
            }),
            [
                dataTestId,
                getItemProps,
                highlightedIndex,
                multiple,
                optionClassName,
                optionProps,
                optionsSize,
                selectedItems,
            ],
        );

        useEffect(() => {
            if (defaultOpen) openMenu();
        }, [defaultOpen, openMenu]);

        useEffect(() => {
            if (openProp) {
                openMenu();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const calcOptionsListWidth = useCallback(() => {
            if (listRef.current) {
                const widthAttr = optionsListWidth === 'field' ? 'width' : 'minWidth';

                const optionsListMinWidth = rootRef.current
                    ? rootRef.current.getBoundingClientRect().width
                    : 0;

                listRef.current.setAttribute('style', '');
                listRef.current.style[widthAttr] = `${optionsListMinWidth}px`;
            }
        }, [optionsListWidth]);

        useEffect(() => {
            const observer = new ResizeObserver(calcOptionsListWidth);
            if (rootRef.current) {
                observer.observe(rootRef.current);
            }

            return () => {
                observer.disconnect();
            };
        }, [calcOptionsListWidth, open, optionsListWidth]);

        useLayoutEffect(calcOptionsListWidth, [open, optionsListWidth, options, selectedItems]);

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
                    ref: rootRef,
                    ...(disabled && { 'aria-disabled': true }),
                    className: cn(styles.component, { [styles.block]: block }, className),
                })}
                onKeyDown={disabled ? undefined : handleFieldKeyDown}
                tabIndex={-1}
                data-test-id={getDataTestId(dataTestId)}
            >
                {nativeSelect && renderNativeSelect()}

                <Field
                    selectedMultiple={selectedItems}
                    selected={selectedItems[0]}
                    setSelectedItems={setSelectedItems}
                    toggleMenu={toggleMenu}
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
                    className={fieldClassName}
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
                    dataTestId={getDataTestId(dataTestId, 'field')}
                    {...fieldProps}
                />

                {name && !nativeSelect && renderValue()}

                {!nativeSelect && (
                    <Popover
                        open={open}
                        withTransition={false}
                        anchorElement={fieldRef.current as HTMLElement}
                        position={popoverPosition}
                        preventFlip={preventFlip}
                        popperClassName={cn(styles.popoverInner, popperClassName)}
                        update={updatePopover}
                        zIndex={zIndexPopover}
                    >
                        {needRenderOptionsList && (
                            <div
                                {...menuProps}
                                className={cn(optionsListClassName, styles.optionsList)}
                            >
                                <OptionsList
                                    {...optionsListProps}
                                    flatOptions={flatOptions}
                                    highlightedIndex={highlightedIndex}
                                    open={open}
                                    size={size}
                                    options={options}
                                    Optgroup={Optgroup}
                                    Option={Option}
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                    toggleMenu={toggleMenu}
                                    getOptionProps={getOptionProps}
                                    visibleOptions={visibleOptions}
                                    onScroll={onScroll}
                                    dataTestId={getDataTestId(dataTestId, 'options-list')}
                                />
                            </div>
                        )}
                    </Popover>
                )}
            </div>
        );
    },
);
