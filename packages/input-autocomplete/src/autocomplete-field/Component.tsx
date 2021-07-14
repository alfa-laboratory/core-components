import React, { useCallback, useRef } from 'react';
import cn from 'classnames';
import { Input as DefaultInput } from '@alfalab/core-components-input';
import { FieldProps } from '@alfalab/core-components-select';
import mergeRefs from 'react-merge-refs';
import { InputAutocompleteProps } from '../Component';

import styles from './index.module.css';

export type AutocompleteFieldProps = FieldProps &
    Pick<InputAutocompleteProps, 'Input' | 'inputProps' | 'value' | 'onInput' | 'readOnly'>;

export const AutocompleteField = ({
    label,
    placeholder,
    size,
    Arrow,
    Input = DefaultInput,
    value,
    error,
    success,
    hint,
    disabled,
    readOnly,
    onInput,
    inputProps = {},
    innerProps,
}: AutocompleteFieldProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const { onClick, onFocus } = innerProps;

    const inputDisabled = disabled || readOnly;

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            wrapperRef={mergeRefs([innerProps.ref, inputProps.wrapperRef])}
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            ref={mergeRefs([inputRef, inputProps.ref])}
            disabled={disabled}
            readOnly={readOnly}
            block={true}
            label={label}
            placeholder={placeholder}
            size={size}
            error={error}
            success={success}
            hint={hint}
            onChange={onInput}
            onClick={inputDisabled ? undefined : handleClick}
            onFocus={inputDisabled ? undefined : onFocus}
            autoComplete='off'
            value={value}
            rightAddons={
                (Arrow || inputProps.rightAddons) && (
                    <React.Fragment>
                        {inputProps.rightAddons}
                        {Arrow && (
                            <span
                                className={cn(styles.arrow, {
                                    [styles.error]: error,
                                })}
                            >
                                {Arrow}
                            </span>
                        )}
                    </React.Fragment>
                )
            }
        />
    );
};
