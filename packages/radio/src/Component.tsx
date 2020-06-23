import React, { InputHTMLAttributes, forwardRef, ChangeEvent, ReactNode } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type NativeProps = InputHTMLAttributes<HTMLInputElement>;

export type RadioProps = Omit<NativeProps, 'type'> & {
    dataTestId?: string;
    description?: ReactNode;
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
        {
            onChange,
            className,
            name,
            disabled,
            dataTestId,
            children,
            checked,
            description,
            ...restProps
        },
        ref,
    ) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            // console.warn('handleChange', onChange)
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
                <div className={styles.circle} />
                <div className={styles.content}>
                    <span className={styles.label}>{children}</span>
                    {description && <span className={styles.description}>{description}</span>}
                </div>
            </label>
        );
    },
);
