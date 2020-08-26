import React from 'react';
import mergeRefs from 'react-merge-refs';
import { Input as DefaultInput } from '@alfalab/core-components-input';
import { FieldProps } from '../../typings';
import { AutocompleteProps } from '../autocomplete/Component';

export type AutocompleteFieldProps = FieldProps &
    Pick<AutocompleteProps, 'Input' | 'inputProps' | 'value' | 'onInput'>;

export const AutocompleteField = ({
    disabled,
    open,
    label,
    placeholder,
    Arrow,
    size,
    Input,
    value,
    onInput,
    inputProps = {},
    innerProps = {},
}: AutocompleteFieldProps) => {
    const InputComponent = Input || DefaultInput;
    return (
        <InputComponent
            block={true}
            label={label}
            placeholder={placeholder}
            size={size}
            rightAddons={Arrow}
            focused={!disabled && open}
            {...innerProps}
            {...inputProps}
            onChange={onInput}
            value={value}
            ref={mergeRefs([innerProps.ref || null, inputProps.ref || null])}
        />
    );
};
