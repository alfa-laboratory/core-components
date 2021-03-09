import React, { FC } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export const colors = ['green', 'orange', 'red', 'blue', 'grey', 'teal', 'purple'] as const;

export type StatusProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     *  Вид компонента
     */
    view?: 'contrast' | 'soft';

    /**
     * Цветовое оформление иконки
     */
    color?: typeof colors[number];

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Status: FC<StatusProps> = ({
    className,
    view = 'soft',
    color = 'green',
    children,
    dataTestId,
}) => (
    <span
        className={cn(styles.component, styles[color], styles[view], className)}
        data-test-id={dataTestId}
    >
        {children}
    </span>
);
