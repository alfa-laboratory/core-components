import React, { FC, ChangeEvent, forwardRef } from 'react';
import { InputProps } from '@alfalab/core-components-input';
import { BaseSelectProps } from '../../typings';
import { OptionsList as DefaultOptionsList } from '../options-list';
import { Option as DefaultOption } from '../option';
import { Optgroup as DefaultOptgroup } from '../optgroup';
import { BaseSelect } from '../base-select';
import { AutocompleteField } from '../autocomplete-field/Component';

export type AutocompleteProps = Omit<BaseSelectProps, 'Field' | 'nativeSelect'> & {
    /**
     * Компонент ввода значения
     */
    Input?: FC<InputProps>;

    /**
     * Пропсы, которые будут прокинуты в инпут
     */
    inputProps?: InputProps & Record<string, unknown>;

    /**
     * Значение поля ввода
     */
    value?: string;

    /**
     * Обработчик ввода
     */
    onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
    (
        {
            OptionsList = DefaultOptionsList,
            Optgroup = DefaultOptgroup,
            Option = DefaultOption,
            Input,
            inputProps = {},
            onInput,
            value,
            closeOnSelect = false,
            options,
            ...restProps
        },
        ref,
    ) => (
        <BaseSelect
            ref={ref}
            autocomplete={true}
            options={options}
            closeOnSelect={closeOnSelect}
            Option={Option}
            Field={AutocompleteField}
            fieldProps={{
                Input,
                onInput,
                value,
                inputProps,
            }}
            Optgroup={Optgroup}
            OptionsList={OptionsList}
            {...restProps}
        />
    ),
);
