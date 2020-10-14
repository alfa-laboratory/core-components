import React from 'react';
import { Input as DefaultInput } from '@alfalab/core-components-input';
import { FieldProps } from '@alfalab/core-components-select';
import { InputAutocompleteProps } from '../Component';

export type AutocompleteFieldProps = FieldProps &
    Pick<InputAutocompleteProps, 'Input' | 'inputProps' | 'value' | 'onInput'>;

export const AutocompleteField = ({
    label,
    placeholder,
    Arrow,
    size,
    Input = DefaultInput,
    value,
    error,
    hint,
    disabled,
    onInput,
    inputProps = {},
    innerProps = {},
}: AutocompleteFieldProps) => (
    <Input
        {...innerProps}
        {...inputProps}
        wrapperRef={innerProps.ref}
        disabled={disabled}
        block={true}
        label={label}
        placeholder={placeholder}
        size={size}
        error={error}
        hint={hint}
        rightAddons={
            <React.Fragment>
                {inputProps.rightAddons}
                {Arrow}
            </React.Fragment>
        }
        onChange={onInput}
        autoComplete='off'
        value={value}
    />
);
