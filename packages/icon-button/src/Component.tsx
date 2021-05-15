import React, { ButtonHTMLAttributes, ElementType, forwardRef } from 'react';
import cn from 'classnames';

import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';
import defaultColors from './default.module.css';
import invertedColors from './inverted.module.css';

export type IconButtonProps = {
    /**
     * Компонент иконки
     */
    icon: ElementType<{ className?: string }>;

    /**
     * Тип кнопки
     */
    view?: 'primary' | 'secondary' | 'transparent' | 'negative';

    /**
     * Размер компонента
     */
    size?: 'xxs' | 'xs' | 's';

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Использует инвертированные цвета для компонента
     */
    inverted?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'>;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        { className, icon: Icon, view = 'primary', size = 's', inverted = false, ...restProps },
        ref,
    ) => {
        const colorStyles = inverted ? invertedColors : defaultColors;

        return (
            <Button
                {...restProps}
                ref={ref}
                view='ghost'
                className={cn(className, colorStyles[view])}
                size='s'
                leftAddons={
                    <span className={cn(styles.iconWrapper, styles[size])}>
                        <Icon className={styles.icon} />
                    </span>
                }
            />
        );
    },
);
