import React, { FC, ChangeEvent } from 'react';
import mergeRefs from 'react-merge-refs';
import { Input as DefaultInput, InputProps } from '@alfalab/core-components-input';
import { OptionsList as DefaultOptionsList } from '../options-list';
import { Option as DefaultOption } from '../option';
import { Optgroup as DefaultOptgroup } from '../optgroup';
import { BaseSelect } from '../base-select';
import { SelectProps, FieldProps } from '../../typings';

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

const AutocompleteField = ({
    disabled,
    open,
    label,
    placeholder,
    Arrow,
    size,
    Input = DefaultInput,
    value,
    onInput,
    inputProps = {},
    innerProps,
}: FieldProps & {
    Input?: AutocompleteProps['Input'];
    value?: AutocompleteProps['value'];
    onInput?: AutocompleteProps['onInput'];
    inputProps?: Record<string, unknown>;
}) => (
    <Input
        block={true}
        label={label}
        placeholder={placeholder}
        size={size}
        value={value}
        onChange={onInput}
        rightAddons={Arrow}
        focused={!disabled && open}
        {...innerProps}
        {...inputProps}
        ref={mergeRefs([innerProps.ref, inputProps.ref])}
    />
);

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
