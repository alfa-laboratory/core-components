import cn from 'classnames';
import React from 'react';

import styles from './index.module.css';

const RADIUS = 29;
const MAX_PROGRESS = 100;
const MIN_PROGRESS = 0;

export type CircularProgressBarProps = {
    /**
     * Уровень прогресса
     */
    value: number;

    /**
     * Значение внутри прогресс бара от 0 до 100
     */
    label?: string;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Id компонента для тестов
     */
    dataTestId?: string;
};

/**
 * Компонент круглого прогресс бара.
 */
export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
    value,
    label,
    className,
    dataTestId,
}) => {
    const getPercentage = () => {
        const diameter = RADIUS * 2;
        const circlePerimeter = diameter * Math.PI;
        const progress = Math.min(Math.max(value, MIN_PROGRESS), MAX_PROGRESS);

        return (circlePerimeter * progress) / 100;
    };

    return (
        <div className={cn(styles.component, className)} data-test-id={dataTestId}>
            <svg xmlns='http://www.w3.org/2000/svg'>
                <circle
                    className={styles.backgroundCircle}
                    cx='163'
                    cy='37'
                    r={RADIUS}
                    transform='rotate(-90 100 100)'
                />
                <circle
                    className={styles.progressCircle}
                    cx='163'
                    cy='37'
                    r={RADIUS}
                    strokeDasharray={`${getPercentage()}, 1000`}
                    transform='rotate(-90 100 100)'
                />
            </svg>
            {Boolean(label) && <span className={styles.label}>{label}</span>}
        </div>
    );
};
