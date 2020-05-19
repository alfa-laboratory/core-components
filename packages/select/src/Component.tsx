import React, { useRef, ReactNode, useMemo, useCallback, ChangeEvent } from 'react';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useSelect, UseMultipleSelectionProps } from 'downshift';
import { TransitionProps } from 'react-transition-group/Transition';
import { Field as DefaultField } from './components/Field';
import { Menu as DefaultMenu } from './components/Menu';
import { Option as DefaultOption } from './components/Option';

import styles from './index.module.css';

export type ItemShape = {
    /**
     * Значение выбранного пункта (например, для отправки на сервер)
     */
    value: string | number;

    /**
     * Контент, который будет отрендерен в выпадающем списке и в поле при выборе
     */
    text?: ReactNode;

    /**
     * Блокирует данный пункт для выбора
     */
    disabled?: boolean;
};

export type SelectProps<T extends ItemShape> = {
    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Список вариантов выбора
     */
    items: T[];

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l' | 'xl';

    /**
     * Атрибут name
     */
    name?: string;

    /**
     * Управление возможностью выбора значения
     */
    disabled?: boolean;

    /**
     * Лейбл поля
     */
    label?: ReactNode;

    /**
     * Плейсхолдер поля
     */
    placeholder?: string;

    /**
     * Возможность выбрать несколько значений
     */
    multiple?: boolean;

    /**
     * Позволяет снять выбранное значение
     */
    allowUnselect?: boolean;

    /**
     * Закрывать меню после выбора?
     */
    closeOnSelect?: boolean;

    /**
     * Рендерить стрелку?
     */
    showArrow?: boolean;

    /**
     * Список выбранных пунктов (controlled-селект)
     */
    selected: T | T[];

    /**
     * Компонент поля
     */
    Field?: React.ComponentType<FieldProps<T>>;

    /**
     * Компонент выпадающего меню
     */
    Menu?: React.ComponentType<MenuProps<T>>;

    /**
     * Компонент пункта меню
     */
    Option?: React.ComponentType<OptionProps<T>>;

    /**
     * Кастомный рендер выбранного пункта
     */
    valueRenderer?: (items: T[]) => ReactNode;

    /**
     * Кастомный рендер пункта меню
     */
    itemRenderer?: (item: T) => ReactNode;

    /**
     * Обработчик выбора
     */
    onChange?: (
        event?: ChangeEvent,
        payload?: {
            selected?: T | T[];
            value?: string | number | Array<string | number>;
            name?: string;
        },
    ) => void;
};

export type FieldProps<T extends ItemShape> = Pick<
    SelectProps<T>,
    'multiple' | 'size' | 'disabled' | 'label' | 'placeholder' | 'valueRenderer' | 'showArrow'
> & {
    /**
     * Список выбранных пунктов
     */
    selectedItems: T[];

    /**
     * Флаг, открыто ли меню
     */
    isOpen?: boolean;

    /**
     * Флаг, есть ли выбранные пункты
     */
    filled?: boolean;

    /**
     * Слот для дополнительного контента слева
     */
    leftAddons?: ReactNode;
};

export type MenuProps<T extends ItemShape> = Pick<SelectProps<T>, 'multiple' | 'items' | 'size'> & {
    /**
     * Список пунктов меню
     */
    children: (props: Pick<OptionProps<T>, 'item' | 'index'>) => ReactNode;

    /**
     * Флаг, открыто ли меню
     */
    isOpen: boolean;
};

export type OptionProps<T extends ItemShape> = Pick<SelectProps<T>, 'itemRenderer' | 'size'> & {
    /**
     * Данные пункта меню
     */
    item: T;

    /**
     * Индект пункта
     */
    index: number;

    /**
     * Флаг, выбран ли данный пункт
     */
    selected?: boolean;

    /**
     * Флаг, подсвечен ли данный пункт
     */
    highlighted?: boolean;

    /**
     * Флаг, заблокирован ли данный пункт
     */
    disabled?: boolean;
};

export function Select<T extends ItemShape>({
    block,
    className,
    items,
    multiple = false,
    allowUnselect = false,
    disabled = false,
    closeOnSelect = true,
    showArrow,
    size = 's',
    label,
    placeholder,
    name,
    Field = DefaultField,
    Menu = DefaultMenu,
    Option = DefaultOption,
    selected,
    valueRenderer,
    itemRenderer,
    onChange,
}: SelectProps<T>) {
    const useMultipleSelectionProps: UseMultipleSelectionProps<T> = {
        itemToString: item => item.value.toString(),
        onSelectedItemsChange: changes => {
            if (onChange) {
                let value;
                if (changes.selectedItems) {
                    value = changes.selectedItems.map(item => item.value);
                    // eslint-disable-next-line prefer-destructuring
                    if (!multiple) value = value[0];
                }

                onChange(undefined, {
                    selected: multiple ? changes.selectedItems : (changes.selectedItems || [])[0],
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
        getSelectedItemProps,
        addSelectedItem,
        removeSelectedItem,
        selectedItems,
        setSelectedItems,
    } = useMultipleSelection<T>(useMultipleSelectionProps);

    const {
        isOpen,
        getToggleButtonProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        setHighlightedIndex,
    } = useSelect<T | undefined>({
        items,
        itemToString: item => (item ? item.value.toString() : ''),
        stateReducer: (_, actionAndChanges) => {
            const { type, changes } = actionAndChanges;
            const { selectedItem } = changes;

            switch (type) {
                case useSelect.stateChangeTypes.MenuKeyDownEnter:
                case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
                case useSelect.stateChangeTypes.ItemClick:
                    if (selectedItem) {
                        const alreadySelected = selectedItems.find(item => item === selectedItem);

                        if ((multiple || allowUnselect) && alreadySelected) {
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
                    };
                default:
                    return changes;
            }
        },
    });

    const selectRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLElement>(null);

    const getPortalContainer = () => selectRef.current as HTMLDivElement;

    const getTransitionProps = useMemo((): Partial<TransitionProps> => {
        return {
            appear: true,
            onEntered: () => {
                /*
                 * Из-за использования Transition внутри Popover'а - меню и его пункты рендерятся с задержкой.
                 * Поэтому приходится вручную перезапускать некоторую логику. Либо стоит отказаться от анимации через Transition
                 */
                if (menuRef.current !== null) {
                    menuRef.current.focus();

                    if (selectedItems.length) {
                        /*
                         * Перезапускаем scrollIntoView
                         * https://github.com/downshift-js/downshift/blob/master/src/hooks/useSelect/index.js#L189
                         */
                        setHighlightedIndex(-1);
                        setTimeout(() => {
                            setHighlightedIndex(
                                items.indexOf(selectedItems[selectedItems.length - 1]),
                            );
                        }, 0);
                    }
                }
            },
        };
    }, [items, selectedItems, setHighlightedIndex]);

    const fieldProps = {
        selectedItems,
        getSelectedItemProps,
        removeSelectedItem,
        multiple,
        size,
        isOpen,
        showArrow,
        disabled,
        filled: selectedItems.length > 0,
        label,
        placeholder,
        valueRenderer,
    };

    const menuProps = {
        multiple,
        isOpen,
        items,
        size,
    };

    const WrappedOption = useCallback(
        ({ item, index, ...rest }: Pick<OptionProps<T>, 'item' | 'index'>) => {
            const optionProps = {
                ...rest,
                item,
                index,
                size,
                itemRenderer,
                disabled: item.disabled,
                highlighted: index === highlightedIndex,
                selected: selectedItems.includes(item),
            };

            return (
                <div {...getItemProps({ index, item, disabled: item.disabled })} key={item.value}>
                    <Option {...optionProps} />
                </div>
            );
        },
        [getItemProps, highlightedIndex, itemRenderer, selectedItems, size],
    );

    const renderValue = useCallback(
        () =>
            selectedItems.map(item => (
                <input type='hidden' name={name} value={item.value} key={item.value} />
            )),
        [selectedItems, name],
    );

    return (
        <div ref={selectRef} className={cn(styles.component, className, { [styles.block]: block })}>
            <button
                type='button'
                {...getToggleButtonProps({ disabled })}
                className={styles.fieldWrapper}
            >
                <Field {...fieldProps} />
            </button>

            {name && renderValue()}

            {selectRef.current && (
                <Popover
                    open={isOpen}
                    transition={getTransitionProps}
                    anchorElement={selectRef.current}
                    position='bottom-start'
                    getPortalContainer={getPortalContainer}
                    popperClassName={styles.popover}
                >
                    <div {...getMenuProps({ ref: menuRef })} className={styles.menuWrapper}>
                        <Menu {...menuProps}>{WrappedOption}</Menu>
                    </div>
                </Popover>
            )}
        </div>
    );
}
