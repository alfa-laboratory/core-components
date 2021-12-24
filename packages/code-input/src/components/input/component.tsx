import React, {
    ChangeEvent,
    ChangeEventHandler,
    forwardRef,
    InputHTMLAttributes,
    KeyboardEvent,
    KeyboardEventHandler,
} from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type InputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'onKeyDown'
> & {
    index: number;
    value: string;
    error: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>, payload: { index: number }) => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>, payload: { index: number }) => void;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ index, error, disabled, value, onChange, onKeyDown, onFocus }, ref) => {
        const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
            onChange(event, { index });
        };

        const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = event => {
            onKeyDown(event, { index });
        };

        return (
            <input
                ref={ref}
                className={cn(styles.input, {
                    [styles.hasError]: error,
                    [styles.disabled]: disabled,
                })}
                disabled={disabled}
                value={value}
                autoComplete={index === 0 ? 'one-time-code' : ''}
                inputMode='numeric'
                pattern='[0-9]*'
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
            />
        );
    },
);
