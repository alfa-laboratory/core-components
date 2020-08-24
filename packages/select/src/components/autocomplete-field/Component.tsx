import React from 'react';
import mergeRefs from 'react-merge-refs';
import { Input as DefaultInput } from '@alfalab/core-components-input';
import { FieldProps } from '../../typings';
import { AutocompleteProps } from '../autocomplete/Component';

export type AutocompleteFieldProps = FieldProps & {
    Input?: AutocompleteProps['Input'];
    value?: AutocompleteProps['value'];
    onInput?: AutocompleteProps['onInput'];
    inputProps?: Record<string, unknown>;
};

export const AutocompleteField = ({
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
}: AutocompleteFieldProps) => (
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
