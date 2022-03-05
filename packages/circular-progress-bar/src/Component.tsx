import cn from 'classnames';
import React, { ReactNode, useMemo } from 'react';
import { Typography } from '@alfalab/core-components-typography';

import styles from './index.module.css';

const SIZES = {
    s: 96,
    m: 120,
    l: 144,
};

export type CircularProgressBarProps = {
    /**
     * Уровень прогресса, %
     */
    value: number;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Основной текст
     */
    title?: ReactNode;

    /**
     * Дополнительный текст
     */
    subtitle?: ReactNode;

    /**
     * Цвет заполнения
     */
    view?: 'positive' | 'negative';

    /**
     * Размер (l — 144×144px, m — 120×120px, s — 96×96px)
     */
    size?: 'l' | 'm' | 's';

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
    size = 'm',
    className,
    dataTestId,
    title = value.toString(),
    subtitle,
    children,
}) => {
    const memorized = useMemo(() => {
        const strokeWidth = 8;
        const maxProgress = 100;
        const minProgress = 0;
        const width = SIZES[size];
        const height = SIZES[size];
        const center = width / 2;
        const radius = center - strokeWidth / 2;
        const circumference = Math.PI * radius * 2;
        const progress = Math.min(Math.max(value, minProgress), maxProgress);
        const strokeDasharray = circumference.toFixed(3);
        const strokeDashoffset = (((100 - progress) / 100) * circumference).toFixed(3);

        return {
            width,
            height,
            center,
            radius,
            strokeDasharray,
            strokeDashoffset,
        };
    }, [value, size]);

    return (
        <div className={cn(styles.component, styles[size], className)} data-test-id={dataTestId}>
            <svg
                viewBox={`0 0 ${memorized.width} ${memorized.height}`}
                className={styles.svg}
                xmlns='http://www.w3.org/2000/svg'
            >
                <circle
                    className={styles.backgroundCircle}
                    cx={memorized.center}
                    cy={memorized.center}
                    r={memorized.radius}
                />
                <circle
                    className={cn(styles.progressCircle, styles[view])}
                    cx={memorized.center}
                    cy={memorized.center}
                    r={memorized.radius}
                    strokeDasharray={memorized.strokeDasharray}
                    strokeDashoffset={memorized.strokeDashoffset}
                    transform={`rotate(${-90} ${memorized.center} ${memorized.center})`}
                />
            </svg>
            <div className={styles.label}>
                {children || (
                    <React.Fragment>
                        {typeof title === 'string' ? (
                            <Typography.Title
                                className={styles.title}
                                color='secondary'
                                tag='div'
                                view={size === 'l' ? 'small' : 'xsmall'}
                            >
                                {title}
                            </Typography.Title>
                        ) : (
                            title
                        )}
                        {typeof subtitle === 'string' ? (
                            <Typography.Text
                                tag='div'
                                className={styles.subtitle}
                                color='primary'
                                view='primary-small'
                            >
                                {subtitle}
                            </Typography.Text>
                        ) : (
                            subtitle
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};
