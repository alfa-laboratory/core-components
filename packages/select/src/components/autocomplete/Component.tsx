import React, { FC, ChangeEvent, RefAttributes } from 'react';
import { SelectProps } from 'src/typings';
import { InputProps } from '@alfalab/core-components-input';
import { OptionsList as DefaultOptionsList } from '../options-list';
import { Option as DefaultOption } from '../option';
import { Optgroup as DefaultOptgroup } from '../optgroup';
import { BaseSelect } from '../base-select';
import { AutocompleteField } from '../autocomplete-field/Component';

export type AutocompleteProps = Omit<SelectProps, 'Field' | 'nativeSelect'> & {
    /**
     * Компонент ввода значения
     */
    Input?: FC<Omit<InputProps, 'value'> & { value?: string } & Record<string, unknown>>;

    /**
     * Пропсы, которые будут прокинуты в инпут
     */
    inputProps?: InputProps & RefAttributes<HTMLElement> & Record<string, unknown>;

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
