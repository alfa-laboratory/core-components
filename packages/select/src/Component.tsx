import React, { useRef, ReactNode, useMemo, useCallback, ChangeEvent } from 'react';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useSelect, UseMultipleSelectionProps } from 'downshift';
import { TransitionProps } from 'react-transition-group/Transition';
import { Field as DefaultField } from './components/Field';
import { Menu as DefaultMenu } from './components/Menu';
import { MenuItem as DefaultMenuItem } from './components/MenuItem';
import { Optgroup as DefaultOptgroup } from './components/Optgroup';

import styles from './index.module.css';

export type ItemShape = {
    /**
     * Значение выбранного пункта (например, для отправки на сервер)
     */
    value: string;

    /**
     * Контент, который будет отрендерен в выпадающем списке и в поле при выборе
     */
    text?: ReactNode;

    /**
     * Текст для нативного option (nativeMenu)
     */
    nativeText?: string;

    /**
     * Блокирует данный пункт для выбора
     */
    disabled?: boolean;
};

export type GroupShape = {
    /**
     * Заголовок группы
     */
    label?: string;

    /**
     * Дочерние элементы
     */
    items: ItemShape[];
};

export type SelectProps = {
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
    items: Array<ItemShape | GroupShape>;

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
    selected?: ItemShape | ItemShape[];

    /**
     * Рендерит нативный селект вместо выпадающего меню. (на десктопе использовать только с multiple=false)
     */
    nativeMenu?: boolean;

    /**
     * Компонент поля
     */
    Field?: React.ComponentType<FieldProps>;

    /**
     * Компонент выпадающего меню
     */
    Menu?: React.ComponentType<MenuProps>;

    /**
     * Компонент группы
     */
    Optgroup?: React.ComponentType<OptgroupProps>;

    /**
     * Компонент пункта меню
     */
    MenuItem?: React.ComponentType<MenuItemProps>;

    /**
     * Кастомный рендер выбранного пункта
     */
    valueRenderer?: (items: ItemShape[]) => ReactNode;

    /**
     * Кастомный рендер пункта меню
     */
    itemRenderer?: (item: ItemShape) => ReactNode;

    /**
     * Обработчик выбора
     */
    onChange?: (
        event?: ChangeEvent,
        payload?: {
            selected?: ItemShape | ItemShape[];
            value?: string | number | Array<string | number>;
            name?: string;
        },
    ) => void;
};

export type FieldProps = Pick<
    SelectProps,
    'multiple' | 'size' | 'disabled' | 'label' | 'placeholder' | 'valueRenderer' | 'showArrow'
> & {
    /**
     * Список выбранных пунктов
     */
    selectedItems: ItemShape[];

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

export type MenuProps = Pick<SelectProps, 'multiple' | 'items' | 'size' | 'Optgroup'> & {
    /**
     * Список пунктов меню
     */
    children: (props: Pick<MenuItemProps, 'item' | 'index'>) => ReactNode;

    /**
     * Флаг, открыто ли меню
     */
    isOpen: boolean;
};

export type OptgroupProps = {
    /**
     * Заголовок группы
     */
    label?: string;

    /**
     * Дочерние элементы
     */
    children: ReactNode;
};

export type MenuItemProps = Pick<SelectProps, 'itemRenderer' | 'size'> & {
    /**
     * Данные пункта меню
     */
    item: ItemShape;

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

export function Select({
    block,
    className,
    items,
    multiple = false,
    allowUnselect = false,
    disabled = false,
    closeOnSelect = true,
    showArrow = true,
    size = 's',
    nativeMenu = false,
    label,
    placeholder,
    name,
    Field = DefaultField,
    Menu = DefaultMenu,
    Optgroup = DefaultOptgroup,
    MenuItem = DefaultMenuItem,
    selected,
    valueRenderer,
    itemRenderer,
    onChange,
}: SelectProps) {
    const flatItems = useMemo(
        () =>
            items.reduce((acc: ItemShape[], item) => {
                if ('items' in item) {
                    return acc.concat(item.items);
                }

                acc.push(item);
                return acc;
            }, []),
        [items],
    );

    const useMultipleSelectionProps: UseMultipleSelectionProps<ItemShape> = {
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
    } = useMultipleSelection(useMultipleSelectionProps);

    const {
        isOpen,
        getToggleButtonProps,
        getMenuProps,
        highlightedIndex,
        getItemProps,
        setHighlightedIndex,
    } = useSelect<ItemShape>({
        items: flatItems,
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
                                flatItems.indexOf(selectedItems[selectedItems.length - 1]),
                            );
                        }, 0);
                    }
                }
            },
        };
    }, [flatItems, selectedItems, setHighlightedIndex]);

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
        Optgroup,
    };

    const WrappedMenuItem = useCallback(
        ({ item, index, ...rest }: Pick<MenuItemProps, 'item' | 'index'>) => {
            const itemProps = {
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
                    <MenuItem {...itemProps} />
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

    const handleNativeSelectChange = useCallback(
        event => {
            const selectedOptions = [...event.target.options].reduce((acc, option, index) => {
                if (option.selected) acc.push(flatItems[index]);
                return acc;
            }, []);

            setSelectedItems(selectedOptions);
        },
        [flatItems, setSelectedItems],
    );

    const renderNativeSelect = useCallback(() => {
        const value = multiple
            ? selectedItems.map(item => item.value)
            : (selectedItems[0] || {}).value;

        const renderOption = (item: ItemShape) => (
            <option value={item.value} disabled={item.disabled} key={item.value}>
                {item.nativeText || item.text || item.value}
            </option>
        );

        return (
            <select
                className={styles.nativeSelect}
                disabled={disabled}
                multiple={multiple}
                name={name}
                value={value}
                onChange={handleNativeSelectChange}
                tabIndex={0}
            >
                {items.map(item =>
                    'items' in item ? (
                        <optgroup label={item.label} key={item.label}>
                            {item.items.map(renderOption)}
                        </optgroup>
                    ) : (
                        renderOption(item)
                    ),
                )}
            </select>
        );
    }, [multiple, selectedItems, disabled, name, handleNativeSelectChange, items]);

    return (
        <div ref={selectRef} className={cn(styles.component, className, { [styles.block]: block })}>
            {nativeMenu && renderNativeSelect()}

            <button
                type='button'
                {...getToggleButtonProps({ disabled })}
                className={styles.fieldWrapper}
                tabIndex={nativeMenu ? -1 : 0}
            >
                <Field {...fieldProps} />
            </button>

            {name && !nativeMenu && renderValue()}

            {!nativeMenu && selectRef.current && (
                <Popover
                    open={isOpen}
                    transition={getTransitionProps}
                    anchorElement={selectRef.current}
                    position='bottom-start'
                    getPortalContainer={getPortalContainer}
                    popperClassName={styles.popover}
                >
                    <div {...getMenuProps({ ref: menuRef })} className={styles.menuWrapper}>
                        <Menu {...menuProps}>{WrappedMenuItem}</Menu>
                    </div>
                </Popover>
            )}
        </div>
    );
}
