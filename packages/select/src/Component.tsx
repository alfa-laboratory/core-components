import React, {
    useRef,
    ReactNode,
    useMemo,
    useCallback,
    useState,
    ChangeEvent,
    SelectHTMLAttributes,
} from 'react';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useSelect } from 'downshift';

import styles from './index.module.css';

export type ItemShape = object | string;

export type ItemToStringFn<T> = (item?: T) => string;

export type SelectProps<T extends ItemShape> = Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    'size' | 'unselectable'
> & {
    className?: string;

    items: T[];

    size?: 's' | 'm' | 'l' | 'xl';

    disabled?: boolean;

    label?: ReactNode;

    multiple?: boolean;

    allowUnselect?: boolean;

    placeholder?: string;

    itemToString?: ItemToStringFn<T>;

    Field?: React.ComponentType<FieldProps<T>>;

    Menu?: React.ComponentType<MenuProps<T>>;

    MenuItem?: React.ComponentType<MenuItemProps<T>>;

    onChange?: (
        event?: ChangeEvent<HTMLSelectElement>,
        payload?: {
            selected?: T | T[];
            value?: string | string[];
            name?: SelectHTMLAttributes<HTMLSelectElement>['name'];
        },
    ) => void;
};

export type FieldProps<T extends ItemShape> = Pick<
    SelectProps<T>,
    'multiple' | 'size' | 'disabled' | 'label' | 'placeholder'
> & {
    itemToString: ItemToStringFn<T>;

    focused?: boolean;

    filled?: boolean;

    selectedItems: T[];
};

export type MenuProps<T extends ItemShape> = Pick<SelectProps<T>, 'multiple' | 'items' | 'size'> & {
    children: (props: Pick<MenuItemProps<T>, 'item' | 'index'>) => ReactNode;

    isOpen: boolean;
};

export type MenuItemProps<T extends ItemShape> = {
    item: T;

    itemToString: ItemToStringFn<T>;

    size: SelectProps<T>['size'];

    index: number;

    selected?: boolean;

    highlighted?: boolean;
};

function DefualtField<T extends ItemShape>({
    itemToString,
    size = 'm',
    focused,
    disabled,
    filled,
    label,
    placeholder,
    selectedItems,
}: FieldProps<T>) {
    return (
        <span
            className={cn(styles.field, styles[size], {
                [styles.focused]: focused,
                [styles.disabled]: disabled,
                [styles.filled]: filled,
                [styles.hasLabel]: label,
            })}
        >
            {placeholder && !filled && <span className={styles.placeholder}>{placeholder}</span>}

            {label && <span className={styles.label}>{label}</span>}

            {filled && (
                <span className={styles.value}>
                    {selectedItems.map(item => itemToString(item)).join(', ')}
                </span>
            )}
        </span>
    );
}

export const DefaultMenu = <T extends ItemShape>({ children, isOpen, items }: MenuProps<T>) => {
    return isOpen ? (
        <div className={styles.menu}>{items.map((item, index) => children({ item, index }))}</div>
    ) : null;
};

export function DefaultMenuItem<T extends ItemShape>({
    item,
    itemToString,
    selected,
    highlighted,
}: MenuItemProps<T>) {
    return (
        <span
            className={cn(styles.item, {
                [styles.highlighted]: highlighted,
                [styles.selected]: selected,
            })}
        >
            {itemToString && itemToString(item)}
        </span>
    );
}

export function Select<T extends ItemShape>({
    className,
    items,
    multiple = false,
    allowUnselect = false,
    disabled = false,
    size = 's',
    label,
    placeholder,
    name,
    itemToString = (item?: ItemShape) => (item ? item.toString() : ''),
    Field = DefualtField,
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
        itemToString,
        onSelectedItemsChange: changes => {
            if (onChange) {
                let value;
                if (changes.selectedItems) {
                    value = changes.selectedItems.map(item => itemToString(item));
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
        selectItem,
    } = useSelect<T | undefined>({
        items,
        itemToString,
        onStateChange: changes => {
            // https://github.com/downshift-js/downshift/pull/985
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { type, selectedItem } = changes as any;
            const alreadySelected = selectedItems.find(item => item === selectedItem);

            switch (type) {
                case useSelect.stateChangeTypes.MenuKeyDownEnter:
                case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
                case useSelect.stateChangeTypes.ItemClick:
                    // Необходимо для работы "отжатия" пункта, т.к. при выборе уже выбранного пункта selectedItem === undefined
                    selectItem(undefined);

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

                    break;
                default:
                    break;
            }
        },
    });

    const selectRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLElement>(null);

    const [focused, setFocused] = useState(false);

    const getPortalContainer = () => selectRef.current as HTMLDivElement;

    const getTransitionProps = useMemo(() => {
        return {
            onEntered: () => {
                if (menuRef.current !== null) {
                    menuRef.current.focus();
                }
            },
        };
    }, []);

    const handleSelectFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const handleSelectBlur = useCallback(() => {
        setFocused(false);
    }, []);

    const fieldProps = {
        itemToString,
        selectedItems,
        getSelectedItemProps,
        removeSelectedItem,
        multiple,
        size,
        focused,
        disabled,
        filled: selectedItems.length > 0,
        label,
        placeholder,
    };

    const menuProps = {
        itemToString,
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
                itemToString,
                size,
                highlighted: index === highlightedIndex,
                selected: selectedItems.includes(item),
            };

            return (
                <div {...getItemProps({ index, item })} key={itemToString(item)}>
                    <MenuItem {...itemProps} />
                </div>
            );
        },
        [getItemProps, selectedItems, highlightedIndex, itemToString, size],
    );

    const renderValue = useCallback(
        () =>
            selectedItems.map(item => (
                <input
                    type='hidden'
                    name={name}
                    value={itemToString(item)}
                    key={itemToString(item)}
                />
            )),
        [selectedItems, itemToString, name],
    );

    return (
        <div
            ref={selectRef}
            className={cn(styles.component, className)}
            onFocus={handleSelectFocus}
            onBlur={handleSelectBlur}
        >
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
