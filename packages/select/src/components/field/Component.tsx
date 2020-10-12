import React, { useState, useCallback } from 'react';
import cn from 'classnames';
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
    const { onBlur, onFocus } = restProps;
    const filled = selectedItems.length > 0;

    const handleFocus = useCallback(
        event => {
            setFocused(true);

            if (onFocus) onFocus(event);
        },
        [onFocus],
    );

    const handleBlur = useCallback(
        event => {
            setFocused(false);

            if (onBlur) onBlur(event);
        },
        [onBlur],
    );

    return (
        <FormControl
            className={cn(styles.component, styles[size], {
                [styles.open]: open,
                [styles.hasLabel]: label,
                [styles.disabled]: disabled,
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
    );
};
