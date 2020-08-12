import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type ProgressBarProps = {
    /**
     * Значение заполненной части 0-100
     */
    value: number;

    /**
     * Css-класс для стилизации
     */
    className?: string;

    /**
     * Цвет заполнения
     */
    view?: 'positive' | 'negative';

    /**
     * Id компонента для тестов
     */
    dataTestId?: string;
};

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
    ({ className, value, view = 'positive', dataTestId }, ref) => (
        <div
            role='progressbar'
            aria-valuenow={Math.round(value)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(styles.container, className)}
            data-test-id={dataTestId}
            ref={ref}
        >
            <div
                className={cn(styles.filled, styles[view])}
                style={{ transform: `translateX(${value - 100}%)` }}
            />
        </div>
    ),
);
