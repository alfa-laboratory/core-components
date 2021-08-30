import React, { ButtonHTMLAttributes, ElementType, forwardRef } from 'react';
import cn from 'classnames';

import { Button, ButtonProps } from '@alfalab/core-components-button';

import styles from './index.module.css';
import defaultColors from './default.module.css';
import invertedColors from './inverted.module.css';

const colorStyles = {
    default: defaultColors,
    inverted: invertedColors,
};

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
     * Набор цветов для компонента
     */
    colors?: 'default' | 'inverted';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> &
    Pick<ButtonProps, 'href' | 'target' | 'loading'>;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        { className, icon: Icon, view = 'primary', size = 's', colors = 'default', ...restProps },
        ref,
    ) => {
        return (
            <Button
                {...restProps}
                ref={ref}
                view='ghost'
                className={cn(className, colorStyles[colors][view])}
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
