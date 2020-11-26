import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type SelectButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Вид кнопки
     */
    view?: 'default' | 'filled' | 'outlined' | 'selected';
};

export const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>(
    ({ className, children, disabled, view = 'default', ...restProps }, ref) => (
        <Button
            {...restProps}
            ref={ref}
            view='ghost'
            size='xs'
            disabled={disabled}
            className={cn(styles.button, styles[view], className, {
                [styles.disabled]: disabled,
            })}
        >
            {children}
        </Button>
    ),
);
