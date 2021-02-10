import React, { ButtonHTMLAttributes, ElementType, forwardRef } from 'react';
import cn from 'classnames';

import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type IconButtonProps = {
    /**
     * Компонент иконки
     */
    icon: ElementType<{ className?: string }>;

    /**
     * Тип кнопки
     */
    view?: 'primary' | 'secondary' | 'transparent';

    /**
     * Размер компонента
     */
    size?: 's' | 'm';

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, icon: Icon, view = 'primary', size = 's', ...restProps }, ref) => {
        return (
            <Button
                {...restProps}
                ref={ref}
                view='ghost'
                className={cn(className, styles[view])}
                size={size}
                leftAddons={
                    <span className={cn(styles.iconWrapper, styles[size])}>
                        <Icon className={styles.icon} />
                    </span>
                }
            />
        );
    },
);
