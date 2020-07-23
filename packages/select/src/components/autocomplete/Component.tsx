import React, { useCallback, FC } from 'react';
import { Input as DefaultInput, InputProps } from '@alfalab/core-components-input';
import { OptionsList as DefaultOptionsList } from '../options-list';
import { Option as DefaultOption } from '../option';
import { Optgroup as DefaultOptgroup } from '../optgroup';
import { BaseSelect } from '../base-select';
import { BaseSelectProps } from '../../typings';
import { FieldProps } from '../field';

export type AutocompleteProps = Omit<BaseSelectProps, 'Field' | 'nativeSelect'> & {
    /**
     * Компонент ввода значения
     */
    Input?: FC<InputProps>;

    /**
     * Обработчик ввода
     */
    onInput?: (event?: React.ChangeEvent) => void;

    /**
     * Значение поля ввода
     */
    value?: string;
};

export const Autocomplete = ({
    Input = props => <DefaultInput {...props} />,
    OptionsList = DefaultOptionsList,
    Optgroup = DefaultOptgroup,
    Option = DefaultOption,
    onInput,
    value,
    options,
    ...restProps
}: AutocompleteProps) => {
    const renderField = useCallback(
        ({
            filled,
            focused,
            selected,
            disabled,
            Arrow,
            open,
            toggleMenu,
            ...props
        }: FieldProps) => {
            const handleInput = (event?: React.ChangeEvent) => {
                if (!open) toggleMenu();

                if (onInput) {
                    onInput(event);
                }
            };

            return Input({
                ...props,
                block: true,
                onChange: handleInput,
                rightAddons: Arrow,
                disabled,
                value,
                focused: !disabled && open,
            });
        },
        [Input, onInput, value],
    );

    return (
        <BaseSelect
            autocomplete={true}
            options={options}
            Option={Option}
            Field={renderField}
            Optgroup={Optgroup}
            OptionsList={OptionsList}
            {...restProps}
        />
    );
};
