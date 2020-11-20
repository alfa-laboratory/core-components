import React, { ButtonHTMLAttributes, FC } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type SelectButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    view?: 'default' | 'filled' | 'outlined' | 'selected';
};

export const SelectButton: FC<SelectButtonProps> = ({
    className,
    children,
    disabled,
    view = 'default',
    ...restProps
}) => {
    return (
        <Button
            {...restProps}
            view='ghost'
            size='xs'
            disabled={disabled}
            className={cn(styles.button, styles[view], className, {
                [styles.disabled]: disabled,
            })}
        >
            {children}
        </Button>
    );
};
