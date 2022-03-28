import React, {
    useRef,
    useMemo,
    useCallback,
    MouseEvent,
    forwardRef,
    KeyboardEvent,
    FocusEvent,
    useEffect,
    useState,
} from 'react';
import mergeRefs from 'react-merge-refs';
import cn from 'classnames';
import { BottomSheet } from '@alfalab/core-components-bottom-sheet';
import { Button } from '@alfalab/core-components-button';
import { CheckmarkMIcon } from '@alfalab/icons-glyph/CheckmarkMIcon';
import {
    useMultipleSelection,
    useCombobox,
    UseMultipleSelectionProps,
    UseMultipleSelectionState,
} from 'downshift';
import { Field as DefaultField } from '../field';
import { Arrow as DefaultArrow } from '../arrow';
import { OptionsList as DefaultOptionsList } from '../options-list';
import { Option as DefaultOption } from '../option';
import { Optgroup as DefaultOptgroup } from '../optgroup';
import { Checkmark as DefaultCheckmark } from '../checkmark';

import { BaseSelectProps, OptionShape } from '../../typings';
import { processOptions } from '../../utils';
import { getDataTestId } from '../../../../utils/getDataTestId';

import styles from './index.module.css';

export const SelectMobile = forwardRef(
    (
        {
            dataTestId,
            className,
            fieldClassName,
            optionsListClassName,
            optionClassName,
            optionGroupClassName,
            optionsListProps,
            options,
            autocomplete = false,
            multiple = false,
            allowUnselect = false,
            disabled = false,
            closeOnSelect = !multiple,
            circularNavigation = false,
            defaultOpen = false,
            open: openProp,
            name,
            id,
            selected,
            size = 'm',
            optionsSize = size,
            error,
            hint,
            block,
            label,
            placeholder,
            fieldProps = {},
            optionProps = {},
            valueRenderer,
            onChange,
            onOpen,
            onFocus,
            onScroll,
            Arrow = DefaultArrow,
            Field = DefaultField,
            OptionsList = DefaultOptionsList,
            Optgroup = DefaultOptgroup,
            Option = DefaultOption,
            visibleOptions,
            hasFooter = false,
        }: BaseSelectProps & {
            /**
             * Нужно ли рендерить кнопки с подтверждением / сбросом значений
             */
            hasFooter?: boolean;
        },
        ref,
    ) => {
        const rootRef = useRef<HTMLLabelElement>(null);
        const fieldRef = useRef<HTMLInputElement>(null);
        const listRef = useRef<HTMLDivElement>(null);
        const initiatorRef = useRef<OptionShape | null>(null);

        const [contentScrollTop, setContentScrollTop] = useState(0);

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

                console.log(type, state);

                switch (type) {
                    case useCombobox.stateChangeTypes.InputBlur:
                        console.log(state);

                        return state;
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
                            isOpen: !closeOnSelect || hasFooter,
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

        const handleFieldKeyDown = (event: KeyboardEvent<HTMLDivElement | HTMLInputElement>) => {
            inputProps.onKeyDown(event);
            if (autocomplete && !open && (event.key.length === 1 || event.key === 'Backspace')) {
                // Для автокомплита - открываем меню при начале ввода
                openMenu();
            }

            if (
                [' ', 'Enter'].includes(event.key) &&
                !autocomplete &&
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

        const handleValueReset = () => {
            setSelectedItems([]);
            toggleMenu();
        };

        const getOptionProps = useCallback(
            (option: OptionShape, index: number) => ({
                ...(optionProps as object),
                className: cn(styles.option, optionClassName),
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
                leftCheckmarkHidden: true,
                Checkmark: () => (
                    <DefaultCheckmark
                        selected={selectedItems.includes(option)}
                        className={styles.checkmark}
                        icon={CheckmarkMIcon}
                        position='after'
                    />
                ),
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

        const renderValue = useCallback(
            () =>
                selectedItems.map(option => (
                    <input type='hidden' name={name} value={option.key} key={option.key} />
                )),
            [selectedItems, name],
        );

        const handleOptionListScroll = (event: React.MouseEvent<HTMLDivElement>) => {
            const { scrollTop } = event.currentTarget;

            setContentScrollTop(scrollTop);

            if (onScroll) {
                onScroll(event);
            }
        };

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
                        onFocus: disabled ? undefined : handleFieldFocus,
                        onClick: disabled ? undefined : handleFieldClick,
                        tabIndex: disabled ? -1 : 0,
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

                {name && renderValue()}

                <BottomSheet
                    open={open}
                    onClose={() => toggleMenu()}
                    className={styles.sheet}
                    contentClassName={styles.sheetContent}
                    containerClassName={styles.sheetContainer}
                    title={placeholder}
                    actionButton={
                        hasFooter && (
                            <div className={styles.footer}>
                                <Button
                                    view='primary'
                                    size='s'
                                    className={styles.footerButton}
                                    onClick={toggleMenu}
                                >
                                    Применить
                                </Button>
                                <Button
                                    view='secondary'
                                    size='s'
                                    className={styles.footerButton}
                                    onClick={handleValueReset}
                                >
                                    Сбросить
                                </Button>
                            </div>
                        )
                    }
                    contentScrollTop={contentScrollTop}
                    stickyHeader={true}
                    hasCloser={true}
                >
                    <div {...menuProps} className={cn(optionsListClassName, styles.optionsList)}>
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
                            onScroll={handleOptionListScroll}
                            dataTestId={getDataTestId(dataTestId, 'options-list')}
                            optionGroupClassName={cn(styles.optionGroup, optionGroupClassName)}
                        />
                    </div>
                </BottomSheet>
            </div>
        );
    },
);
