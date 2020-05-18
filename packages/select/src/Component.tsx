import React, {
    useRef,
    ReactNode,
    useMemo,
    useCallback,
    ChangeEvent,
    SelectHTMLAttributes,
} from 'react';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useSelect } from 'downshift';
import { TransitionProps } from 'react-transition-group/Transition';
import { Field as DefaultField } from './components/Field';
import { Menu as DefaultMenu } from './components/Menu';
import { MenuItem as DefaultMenuItem } from './components/MenuItem';

import styles from './index.module.css';

export type ItemShape = {
    value: string | number;

    text?: ReactNode;
};

export type SelectProps<T extends ItemShape> = Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'size'
> & {
    className?: string;

    items: T[];

    size?: 's' | 'm' | 'l' | 'xl';

    disabled?: boolean;

    label?: ReactNode;

    multiple?: boolean;

    allowUnselect?: boolean;

    closeOnSelect?: boolean;

    placeholder?: string;

    Field?: React.ComponentType<FieldProps<T>>;

    Menu?: React.ComponentType<MenuProps<T>>;

    MenuItem?: React.ComponentType<MenuItemProps<T>>;

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
    'multiple' | 'size' | 'disabled' | 'label' | 'placeholder'
> & {
    selectedItems: T[];

    isOpen?: boolean;

    filled?: boolean;

    showArrow?: boolean;

    leftAddons?: ReactNode;

    valueRenderer?: (items: T[]) => ReactNode;
};

export type MenuProps<T extends ItemShape> = Pick<SelectProps<T>, 'multiple' | 'items' | 'size'> & {
    children: (props: Pick<MenuItemProps<T>, 'item' | 'index'>) => ReactNode;

    isOpen: boolean;
};

export type MenuItemProps<T extends ItemShape> = {
    item: T;

    size: SelectProps<T>['size'];

    index: number;

    selected?: boolean;

    highlighted?: boolean;

    valueRenderer?: (item: T) => ReactNode;
};

export function Select<T extends ItemShape>({
    className,
    items,
    multiple = false,
    allowUnselect = false,
    disabled = false,
    closeOnSelect = true,
    size = 's',
    label,
    placeholder,
    name,
    Field = DefaultField,
    Menu = DefaultMenu,
    MenuItem = DefaultMenuItem,
    onChange,
}: SelectProps<T>) {
    const {
        getSelectedItemProps,
        addSelectedItem,
        removeSelectedItem,
        selectedItems,
        setSelectedItems,
    } = useMultipleSelection<T>({
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
    });

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
        disabled,
        filled: selectedItems.length > 0,
        label,
        placeholder,
    };

    const menuProps = {
        multiple,
        isOpen,
        items,
        size,
    };

    const WrappedMenuItem = useCallback(
        ({ item, index, ...rest }: Pick<MenuItemProps<T>, 'item' | 'index'>) => {
            const itemProps = {
                ...rest,
                item,
                index,
                size,
                highlighted: index === highlightedIndex,
                selected: selectedItems.includes(item),
            };

            return (
                <div {...getItemProps({ index, item })} key={item.value}>
                    <MenuItem {...itemProps} />
                </div>
            );
        },
        [getItemProps, selectedItems, highlightedIndex, size],
    );

    const renderValue = useCallback(
        () =>
            selectedItems.map(item => (
                <input type='hidden' name={name} value={item.value} key={item.value} />
            )),
        [selectedItems, name],
    );

    return (
        <div ref={selectRef} className={cn(styles.component, className)}>
            <button type='button' {...getToggleButtonProps()} className={styles.fieldWrapper}>
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
                        <Menu {...menuProps}>{WrappedMenuItem}</Menu>
                    </div>
                </Popover>
            )}
        </div>
    );
}
