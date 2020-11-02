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
        <div ref={wrapperRef} onFocus={handleFocus} onBlur={handleBlur}>
            <FormControl
                className={cn(styles.component, className, styles[size], {
                    [styles.open]: open,
                    [styles.hasLabel]: label,
                    [styles.disabled]: disabled,
                    [styles.focusVisible]: focusVisible,
                })}
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
                            {Arrow}
                        </React.Fragment>
                    )
                }
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
