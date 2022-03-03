import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type HatchingProgressBarProps = {
    /**
     * Значение заполненной части 0-100
     */
    value: number;

    /**
     * Значение будущей заполненной части 0-100
     */
    hatchValue: number;

    /**
     * Css-класс для стилизации
     */
    className?: string;

    /**
     * Цвет заполнения
     */
    view?:
        | 'positive'
        | 'negative'
        | 'attention'
        | 'link'
        | 'tertiary'
        | 'secondary'
        | 'primary'
        | 'accent';

    /**
     * Id компонента для тестов
     */
    dataTestId?: string;
};

export const HatchingProgressBar = React.forwardRef<HTMLDivElement, HatchingProgressBarProps>(
    ({ className, value, hatchValue, view = 'positive', dataTestId }, ref) => (
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
                className={styles.hatch}
                style={{ transform: `translateX(${hatchValue - 100}%)` }}
            />
            <div
                className={cn(styles.filled, styles[view])}
                style={{ transform: `translateX(${value - 100}%)` }}
            />
        </div>
    ),
);
