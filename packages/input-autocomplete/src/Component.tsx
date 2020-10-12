import React, { FC, ChangeEvent, forwardRef } from 'react';
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
