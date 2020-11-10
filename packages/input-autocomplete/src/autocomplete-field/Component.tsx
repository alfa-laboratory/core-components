import React, { useCallback, useRef } from 'react';
import { Input as DefaultInput } from '@alfalab/core-components-input';
import { FieldProps } from '@alfalab/core-components-select';
import { InputAutocompleteProps } from '../Component';

export type AutocompleteFieldProps = FieldProps &
    Pick<InputAutocompleteProps, 'Input' | 'inputProps' | 'value' | 'onInput'>;

export const AutocompleteField = ({
    label,
    placeholder,
    size,
    Input = DefaultInput,
    value,
    error,
    success,
    hint,
    disabled,
    onInput,
    inputProps = {},
    innerProps,
}: AutocompleteFieldProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const { onClick } = innerProps;

    const handleMouseDown = useCallback(event => {
        event.preventDefault();
    }, []);

    const handleClick = useCallback(
        event => {
            if (onClick) onClick(event);

            if (inputRef.current) {
                inputRef.current.focus();
            }
        },
        [onClick],
    );

    return (
        <Input
            {...inputProps}
            {...innerProps}
            wrapperRef={innerProps.ref}
            ref={inputRef}
            disabled={disabled}
            block={true}
            label={label}
            placeholder={placeholder}
            size={size}
            error={error}
            success={success}
            hint={hint}
            onChange={onInput}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            autoComplete='off'
            value={value}
        />
    );
};
