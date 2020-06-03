import React, { useCallback, ReactNode, ComponentType } from 'react';
import cn from 'classnames';
import { Field as DefaultField, FieldProps } from './components/field';
import { Arrow as DefaultArrow } from './components/arrow';
import { OptionsList as DefaultOptionsList } from './components/options-list';
import { Option as DefaultOption, OptionProps } from './components/option';
import { Optgroup as DefaultOptgroup } from './components/optgroup';
import { BaseSelect } from './components/base-select';
import { BaseSelectProps, BaseArrowProps } from './typings';

import styles from './index.module.css';

export type SelectProps = Omit<BaseSelectProps, 'Field' | 'OptionsList' | 'Option' | 'Optgroup'> & {
    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Лейбл поля
     */
    label?: ReactNode;

    /**
     * Плейсхолдер поля
     */
    placeholder?: string;

    /**
     * Компонент поля
     */
    Arrow?: ComponentType<BaseArrowProps>;

    /**
     * Компонент поля
     */
    Field?: BaseSelectProps['Field'];

    /**
     * Компонент выпадающего меню
     */
    OptionsList?: BaseSelectProps['OptionsList'];

    /**
     * Компонент группы
     */
    Optgroup?: BaseSelectProps['Optgroup'];

    /**
     * Компонент пункта меню
     */
    Option?: BaseSelectProps['Option'];

    /**
     * Кастомный рендер выбранного пункта
     */
    valueRenderer?: FieldProps['valueRenderer'];

    /**
     * Кастомный рендер пункта меню
     */
    optionRenderer?: OptionProps['optionRenderer'];
};

export const Select = ({
    block = false,
    size = 's',
    label,
    placeholder,
    valueRenderer,
    optionRenderer,
    Field = DefaultField,
    Arrow = DefaultArrow,
    Option = DefaultOption,
    OptionsList = DefaultOptionsList,
    Optgroup = DefaultOptgroup,
    ...restProps
}: SelectProps) => {
    const renderField = useCallback(
        props => (
            <Field
                {...props}
                valueRenderer={valueRenderer}
                rightAddons={Arrow && <Arrow open={props.open} />}
                label={label}
                placeholder={placeholder}
                size={size}
            />
        ),
        [Arrow, label, placeholder, size, valueRenderer],
    );

    const renderOption = useCallback(
        props => <Option {...props} optionRenderer={optionRenderer} size={size} />,
        [optionRenderer, size],
    );

    const renderOptionsList = useCallback(props => <OptionsList {...props} size={size} />, [size]);

    return (
        <BaseSelect
            className={cn({ [styles.block]: block })}
            Field={renderField}
            Option={renderOption}
            OptionsList={renderOptionsList}
            Optgroup={Optgroup}
            {...restProps}
        />
    );
};
