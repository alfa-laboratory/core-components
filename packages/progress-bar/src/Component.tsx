import React, { useMemo } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type ProgressBarProps = {
    /** Css-класс для стилизации */
    className?: string;
    /** Значение заполненной части 0-100 */
    value?: number;
    /** Цвет заполнения */
    view?: 'positive' | 'negative';
    /** Id компонента для тестов */
    dataTestId?: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
    className,
    value = 0,
    view = 'positive',
    dataTestId,
}) => {
    const fillTranslate = useMemo(() => {
        return Number((-1 * (100 - value)).toFixed(2));
    }, [value]);

    return (
        <div
            role='progressbar'
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(styles.container, className)}
            data-test-id={dataTestId}
        >
            <div
                className={cn(styles.filled, styles[view])}
                style={{ transform: `translateX(${fillTranslate}%)` }}
            />
        </div>
    );
};
