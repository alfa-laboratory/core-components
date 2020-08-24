import React, { FC, ChangeEvent } from 'react';
import { Input as DefaultInput, InputProps } from '@alfalab/core-components-input';
import { SelectProps } from 'src/typings';
import { OptionsList as DefaultOptionsList } from '../options-list';
import { Option as DefaultOption } from '../option';
import { Optgroup as DefaultOptgroup } from '../optgroup';
import { BaseSelect } from '../base-select';
import { AutocompleteField } from '../autocomplete-field/Component';

export type AutocompleteProps = Omit<SelectProps, 'Field' | 'nativeSelect'> & {
    /**
     * Компонент ввода значения
     */
    Input?: FC<InputProps>;

    /**
     * Пропсы, которые будут прокинуты в инпут
     */
    inputProps?: Record<string, unknown>;

    /**
     * Значение поля ввода
     */
    value?: string;

    /**
     * Обработчик ввода
     */
    onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Autocomplete = ({
    Input = DefaultInput,
    OptionsList = DefaultOptionsList,
    Optgroup = DefaultOptgroup,
    Option = DefaultOption,
    closeOnSelect = false,
    inputProps = {},
    onInput,
    value,
    options,
    ...restProps
}: AutocompleteProps) => (
    <BaseSelect
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
);
