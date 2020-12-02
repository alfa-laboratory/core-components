import React, { useState, useCallback, useRef } from 'react';
import cn from 'classnames';
import { useFocus } from '@alfalab/hooks';
import { FormControl, FormControlProps } from '@alfalab/core-components-form-control';
import { FieldProps as BaseFieldProps } from '../../typings';
import { joinOptions } from '../../utils';

import styles from './index.module.css';

export const Field = ({
    size = 'm',
    open,
    multiple,
    error,
    hint,
    disabled,
    label,
    placeholder,
    selectedMultiple = [],
    selected,
    rightAddons,
    valueRenderer = joinOptions,
    Arrow,
    innerProps,
    className,
    ...restProps
}: BaseFieldProps & FormControlProps) => {
    const [focused, setFocused] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const [focusVisible] = useFocus(wrapperRef, 'keyboard');

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    const value = valueRenderer({ selected, selectedMultiple });

    const filled = Boolean(value);

    return (
        <div
            className={cn(styles.component)}
            ref={wrapperRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <FormControl
                className={cn(className, styles.field, {
                    [styles.hasLabel]: label,
                    [styles.disabled]: disabled,
                    [styles.focusVisible]: focusVisible,
                })}
                block={true}
                size={size}
                focused={open || focused}
                disabled={disabled}
                filled={filled || !!placeholder}
                label={label}
                error={error}
                hint={hint}
                rightAddons={
                    (Arrow || rightAddons) && (
                        <React.Fragment>
                            {rightAddons}
                            {/* TODO: стоит переделать, но это будет мажорка */}
                            {Arrow ? React.cloneElement(Arrow, { className: styles.arrow }) : null}
                        </React.Fragment>
                    )
                }
                {...restProps}
                {...innerProps}
            >
                <div className={cn(styles.contentWrapper)}>
                    {placeholder && !filled && (
                        <span className={cn(styles.placeholder)}>{placeholder}</span>
                    )}
                    {filled && <div className={cn(styles.value)}>{value}</div>}
                </div>
            </FormControl>
        </div>
    );
};
