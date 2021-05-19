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
    dataTestId,
    fieldClassName,
    ...restProps
}: BaseFieldProps & FormControlProps) => {
    const [focused, setFocused] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const [focusVisible] = useFocus(wrapperRef, 'keyboard');

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    const value = valueRenderer({ selected, selectedMultiple });

    const filled = Boolean(value);
    const showLabel = !!label && (filled || !placeholder);

    return (
        <div
            className={styles.component}
            ref={wrapperRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            <FormControl
                fieldClassName={cn(styles.field, fieldClassName, {
                    [styles.disabled]: disabled,
                    [styles.focusVisible]: focusVisible,
                })}
                block={true}
                size={size}
                focused={open || focused}
                disabled={disabled}
                filled={filled}
                label={showLabel && label}
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
                data-test-id={dataTestId}
                {...restProps}
                {...innerProps}
            >
                <div className={styles.contentWrapper}>
                    {placeholder && !filled && (
                        <span className={styles.placeholder}>{placeholder}</span>
                    )}
                    {filled && <div className={styles.value}>{value}</div>}
                </div>
            </FormControl>
        </div>
    );
};
