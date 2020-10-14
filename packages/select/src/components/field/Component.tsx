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
    disabled,
    label,
    placeholder,
    selectedItems = [],
    rightAddons,
    valueRenderer = joinOptions,
    Arrow,
    innerProps = {},
    ...restProps
}: BaseFieldProps & FormControlProps) => {
    const [focused, setFocused] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    const [focusVisible] = useFocus(wrapperRef, 'keyboard');

    const filled = selectedItems.length > 0;

    const handleFocus = useCallback(() => setFocused(true), []);
    const handleBlur = useCallback(() => setFocused(false), []);

    return (
        <div ref={wrapperRef} onFocus={handleFocus} onBlur={handleBlur}>
            <FormControl
                className={cn(styles.component, styles[size], {
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
                rightAddons={
                    <React.Fragment>
                        {rightAddons}
                        {Arrow}
                    </React.Fragment>
                }
                onBlur={handleBlur}
                onFocus={handleFocus}
                {...innerProps}
                {...restProps}
            >
                <div className={styles.contentWrapper}>
                    {placeholder && !filled && (
                        <span className={styles.placeholder}>{placeholder}</span>
                    )}
                    {filled && <div className={styles.value}>{valueRenderer(selectedItems)}</div>}
                </div>
            </FormControl>
        </div>
    );
};
