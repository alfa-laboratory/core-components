import cn from 'classnames';
import React, { useCallback } from 'react';
import { Typography } from '@alfalab/core-components-typography';

import styles from './index.module.css';

export type CircularProgressBarProps = {
    /**
     * Уровень прогресса
     */
    value: number;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Основной текст
     */
    headLine?: string;

    /**
     * Дополнительный текст
     */
    caption?: string;

    /**
     * Цвет заполнения
     */
    view?: 'positive' | 'negative';

    /**
     * Размер
     */
    size?: 'l' | 's';

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
    view = 'positive',
    size = 's',
    className,
    dataTestId,
    headLine,
    caption,
    children,
}) => {
    const strokeWidth = 8;
    const maxProgress = 100;
    const minProgress = 0;
    const width = size === 'l' ? 140 : 116;
    const height = size === 'l' ? 140 : 116;
    const center = width / 2;
    const radius = center - strokeWidth / 2;

    const getPercentage = useCallback(() => {
        const diameter = radius * 2;
        const circlePerimeter = diameter * Math.PI;
        const progress = Math.min(Math.max(value, minProgress), maxProgress);

        return (circlePerimeter * progress) / 100;
    }, [value, radius]);

    return (
        <div className={cn(styles.component, styles[size], className)} data-test-id={dataTestId}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className={styles.svg}
                xmlns='http://www.w3.org/2000/svg'
            >
                <circle
                    className={styles.backgroundCircle}
                    cx={center}
                    cy={center}
                    r={radius}
                    transform={`rotate(${-90} ${center} ${center})`}
                />
                <circle
                    className={cn(styles.progressCircle, styles[view])}
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeDasharray={`${getPercentage()}, 1000`}
                    transform={`rotate(${-90} ${center} ${center})`}
                />
            </svg>
            <div className={styles.label}>
                {children || (
                    <React.Fragment>
                        <Typography.Title
                            className={styles.headLine}
                            color='secondary'
                            tag='div'
                            view={size === 'l' ? 'medium' : 'xsmall'}
                        >
                            {headLine}
                        </Typography.Title>
                        <Typography.Text
                            tag='div'
                            className={styles.caption}
                            color='primary'
                            view='primary-small'
                        >
                            {caption}
                        </Typography.Text>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};
