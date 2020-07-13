import React, { InputHTMLAttributes, forwardRef, ChangeEvent, ReactNode } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;

export type RadioProps = Omit<NativeProps, 'type'> & {
    dataTestId?: string;
    hint?: ReactNode;
    label?: ReactNode;
    onChange?: (
        event?: ChangeEvent<HTMLInputElement>,
        payload?: {
            checked: boolean;
            name?: string;
        },
    ) => void;
};

export const Radio = forwardRef<HTMLLabelElement, RadioProps>(
    (
        { onChange, className, name, disabled, dataTestId, label, checked, hint, ...restProps },
        ref,
    ) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event, { checked: event.target.checked, name });
            }
        };

        return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label
                className={cn(styles.container, className, {
                    [styles.disabled]: disabled,
                    [styles.checked]: checked,
                })}
                ref={ref}
            >
                <input
                    type='radio'
                    onChange={handleChange}
                    data-test-id={dataTestId}
                    disabled={disabled}
                    checked={checked}
                    name={name}
                    {...restProps}
                />
                <span className={styles.circle} />
                <span className={styles.content}>
                    <span className={styles.label}>{label}</span>
                    {hint && <span className={styles.hint}>{hint}</span>}
                </span>
            </label>
        );
    },
);
