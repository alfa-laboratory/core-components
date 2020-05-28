import React, {
    useRef,
    useMemo,
    useCallback,
    useState,
    ReactNode,
    ChangeEvent,
    ComponentType,
} from 'react';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useSelect, UseMultipleSelectionProps } from 'downshift';
import { Field as DefaultField } from './components/field';
import { OptionsList as DefaultOptionsList } from './components/options-list';
import { Option as DefaultOption } from './components/option';
import { Optgroup as DefaultOptgroup } from './components/optgroup';
import { NativeSelect } from './components/native-select';

import styles from './index.module.css';
import { isGroup } from './utils';

export type OptionShape = {
    /**
     * Значение выбранного пункта (например, для отправки на сервер)
     */
    value: string;

    /**
     * Контент, который будет отрендерен в выпадающем списке и в поле при выборе
     */
    text?: ReactNode;

    /**
     * Текст для нативного option (nativeSelect)
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
    options: OptionShape[];
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
    options: Array<OptionShape | GroupShape>;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

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
     * При навигации с клавиатуры переходить от последнего пункта меню к первому и наоборот.
     */
    circularNavigation?: boolean;

    /**
     * Список выбранных пунктов (controlled-селект)
     */
    selected?: OptionShape | OptionShape[];

    /**
     * Рендерит нативный селект вместо выпадающего меню. (на десктопе использовать только с multiple=false)
     */
    nativeSelect?: boolean;

    /**
     * Смещение выпадающего меню по вертикали
     */
    popoverOffset?: number;

    /**
     * Компонент поля
     */
    Field?: ComponentType<FieldProps>;

    /**
     * Компонент выпадающего меню
     */
    OptionsList?: ComponentType<OptionsListProps>;

    /**
     * Компонент группы
     */
    Optgroup?: ComponentType<OptgroupProps>;

    /**
     * Компонент пункта меню
     */
    Option?: ComponentType<OptionProps>;

    /**
     * Кастомный рендер выбранного пункта
     */
    valueRenderer?: (options: OptionShape[]) => ReactNode;

    /**
     * Кастомный рендер пункта меню
     */
    optionRenderer?: (option: OptionShape) => ReactNode;

    /**
     * Обработчик выбора
     */
    onChange?: (
        event?: ChangeEvent,
        payload?: {
            selected?: OptionShape | OptionShape[];
            value?: string | number | Array<string | number>;
            name?: string;
        },
    ) => void;

    /**
     * Обработчик открытия\закрытия селекта
     */
    onOpen?: (payload?: { open?: boolean; name?: string }) => void;
};

export type FieldProps = Pick<
    SelectProps,
    'multiple' | 'size' | 'disabled' | 'label' | 'placeholder' | 'valueRenderer' | 'showArrow'
> & {
    /**
     * Список выбранных пунктов
     */
    value: OptionShape[];

    /**
     * Флаг, открыто ли меню
     */
    open?: boolean;

    /**
     * Флаг, есть ли выбранные пункты
     */
    filled?: boolean;

    /**
     * Флаг, поле находится в фокусе
     */
    focused?: boolean;
};

export type OptionsListProps = Pick<SelectProps, 'multiple' | 'options' | 'size' | 'Optgroup'> & {
    /**
     * Список пунктов меню
     */
    children: (props: Pick<OptionProps, 'option' | 'index'>) => ReactNode;

    /**
     * Плоский список пунктов меню (например, нужно для виртуализации)
     */
    flatOptions: OptionShape[];

    /**
     * Индекс выделенного пункта
     */
    highlightedIndex: number;

    /**
     * Флаг, открыто ли меню
     */
    open: boolean;
};

export type OptgroupProps = {
    /**
     * Заголовок группы
     */
    label?: string;

    /**
     * Дочерние элементы
     */
    children?: ReactNode;
};

export type OptionProps = Pick<SelectProps, 'optionRenderer' | 'size'> & {
    /**
     * Данные пункта меню
     */
    option: OptionShape;

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
    options,
    multiple = false,
    allowUnselect = false,
    disabled = false,
    closeOnSelect = !multiple,
    showArrow = true,
    circularNavigation = false,
    size = 's',
    nativeSelect = false,
    popoverOffset = 4,
    label,
    placeholder,
    name,
    Field = DefaultField,
    OptionsList = DefaultOptionsList,
    Optgroup = DefaultOptgroup,
    Option = DefaultOption,
    selected,
    valueRenderer,
    optionRenderer,
    onChange,
    onOpen,
}: SelectProps) {
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
        ({ option, index, ...rest }: Pick<OptionProps, 'option' | 'index'>) => (
            <Option
                {...rest}
                {...getItemProps({ index, item: option, disabled: option.disabled })}
                key={option.value}
                option={option}
                index={index}
                size={size}
                optionRenderer={optionRenderer}
                disabled={option.disabled}
                highlighted={index === highlightedIndex}
                selected={selectedItems.includes(option)}
            />
        ),
        [getItemProps, highlightedIndex, optionRenderer, selectedItems, size],
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

    const fieldProps: FieldProps = {
        value: selectedItems,
        multiple,
        size,
        open,
        showArrow,
        disabled,
        filled: selectedItems.length > 0,
        focused,
        label,
        placeholder,
        valueRenderer,
    };

    return (
        <div ref={selectRef} className={cn(styles.component, className, { [styles.block]: block })}>
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
                <Field {...fieldProps} />
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
                            size={size}
                            Optgroup={Optgroup}
                        >
                            {WrappedOption}
                        </OptionsList>
                    </Popover>
                </div>
            )}
        </div>
    );
}
