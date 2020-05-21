import React, { useRef, ReactNode, useMemo, useCallback, ChangeEvent, ComponentType } from 'react';
import cn from 'classnames';
import { Popover } from '@alfalab/core-components-popover';
import { useMultipleSelection, useSelect, UseMultipleSelectionProps } from 'downshift';
import { TransitionProps } from 'react-transition-group/Transition';
import { Field as DefaultField } from './components/field';
import { OptionsList as DefaultOptionsList } from './components/options-list';
import { Option as DefaultOption } from './components/option';
import { Optgroup as DefaultOptgroup } from './components/optgroup';
import { NativeSelect } from './components/native-select';

import styles from './index.module.css';

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
     * Список выбранных пунктов (controlled-селект)
     */
    selected?: OptionShape | OptionShape[];

    /**
     * Рендерит нативный селект вместо выпадающего меню. (на десктопе использовать только с multiple=false)
     */
    nativeSelect?: boolean;

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
     * Слот для дополнительного контента слева
     */
    leftAddons?: ReactNode;
};

export type OptionsListProps = Pick<SelectProps, 'multiple' | 'options' | 'size' | 'Optgroup'> & {
    /**
     * Список пунктов меню
     */
    children: (props: Pick<OptionProps, 'option' | 'index'>) => ReactNode;

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
    children: ReactNode;
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
    closeOnSelect = true,
    showArrow = true,
    size = 's',
    nativeSelect = false,
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
}: SelectProps) {
    const selectRef = useRef<HTMLDivElement>(null);
    const optionsListRef = useRef<HTMLElement>(null);

    const getPortalContainer = () => selectRef.current as HTMLDivElement;

    const flatOptions = useMemo(
        () =>
            options.reduce(
                (acc: OptionShape[], option) =>
                    acc.concat('options' in option ? option.options : option),
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
        setHighlightedIndex,
    } = useSelect<OptionShape>({
        items: flatOptions,
        itemToString: item => (item ? item.value.toString() : ''),
        stateReducer: (_, actionAndChanges) => {
            const { type, changes } = actionAndChanges;
            const { selectedItem } = changes;

            switch (type) {
                case useSelect.stateChangeTypes.MenuKeyDownEnter:
                case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
                case useSelect.stateChangeTypes.ItemClick:
                    if (selectedItem) {
                        const alreadySelected = selectedItems.includes(selectedItem);

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

    const getTransitionProps = useMemo((): Partial<TransitionProps> => {
        return {
            appear: true,
            onEntered: () => {
                /*
                 * Из-за использования Transition внутри Popover'а - меню и его пункты рендерятся с задержкой.
                 * Поэтому приходится вручную перезапускать некоторую логику. Либо стоит отказаться от анимации через Transition
                 */
                if (optionsListRef.current !== null) {
                    optionsListRef.current.focus();

                    if (selectedItems.length) {
                        /*
                         * Перезапускаем scrollIntoView
                         * https://github.com/downshift-js/downshift/blob/master/src/hooks/useSelect/index.js#L189
                         */
                        setHighlightedIndex(-1);
                        setTimeout(() => {
                            setHighlightedIndex(
                                flatOptions.indexOf(selectedItems[selectedItems.length - 1]),
                            );
                        }, 0);
                    }
                }
            },
        };
    }, [flatOptions, selectedItems, setHighlightedIndex]);

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
        ({ option, index, ...rest }: Pick<OptionProps, 'option' | 'index'>) => {
            return (
                <div
                    {...getItemProps({ index, item: option, disabled: option.disabled })}
                    key={option.value}
                >
                    <Option
                        {...rest}
                        option={option}
                        index={index}
                        size={size}
                        optionRenderer={optionRenderer}
                        disabled={option.disabled}
                        highlighted={index === highlightedIndex}
                        selected={selectedItems.includes(option)}
                    />
                </div>
            );
        },
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
        label,
        placeholder,
        valueRenderer,
    };

    const optionsListProps = {
        multiple,
        open,
        options,
        size,
        Optgroup,
    };

    return (
        <div ref={selectRef} className={cn(styles.component, className, { [styles.block]: block })}>
            {nativeSelect && renderNativeSelect()}

            <button
                type='button'
                {...getToggleButtonProps({ disabled })}
                className={styles.fieldWrapper}
                tabIndex={nativeSelect ? -1 : 0}
            >
                <Field {...fieldProps} />
            </button>

            {name && !nativeSelect && renderValue()}

            {!nativeSelect && (
                <Popover
                    open={open}
                    transition={getTransitionProps}
                    anchorElement={selectRef.current as HTMLElement}
                    position='bottom-start'
                    getPortalContainer={getPortalContainer}
                    popperClassName={styles.popover}
                >
                    <div {...getMenuProps({ ref: optionsListRef })} className={styles.listWrapper}>
                        <OptionsList {...optionsListProps}>{WrappedOption}</OptionsList>
                    </div>
                </Popover>
            )}
        </div>
    );
}
