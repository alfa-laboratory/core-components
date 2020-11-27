import React, { FC, ChangeEvent, forwardRef, RefAttributes } from 'react';
import { InputProps } from '@alfalab/core-components-input';
import {
    BaseSelectProps,
    OptionsList as DefaultOptionsList,
    Option as DefaultOption,
    Optgroup as DefaultOptgroup,
    BaseSelect,
} from '@alfalab/core-components-select';

import { AutocompleteField } from './autocomplete-field';

export type InputAutocompleteProps = Omit<BaseSelectProps, 'Field' | 'nativeSelect'> & {
    /**
     * Компонент ввода значения
     */
    Input?: FC<InputProps & RefAttributes<HTMLInputElement>>;

    /**
     * Пропсы, которые будут прокинуты в инпут
     */
    inputProps?: InputProps & Record<string, unknown>;

    /**
     * Значение поля ввода
     */
    value?: string;

    /**
     * Отображение иконки успеха
     */
    success?: boolean;

    /**
     * Обработчик ввода
     */
    onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const InputAutocomplete = forwardRef<HTMLInputElement, InputAutocompleteProps>(
    (
        {
            OptionsList = DefaultOptionsList,
            Optgroup = DefaultOptgroup,
            Option = DefaultOption,
            Input,
            inputProps = {},
            onInput,
            value,
            success,
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
                success,
            }}
            Optgroup={Optgroup}
            OptionsList={OptionsList}
            {...restProps}
        />
    ),
);
