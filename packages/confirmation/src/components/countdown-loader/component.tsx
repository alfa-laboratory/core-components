import React, { FC } from 'react';

import styles from './index.module.css';

type Props = {
    progress: number; // 0-1
    className: string;
};

const SIZE = 16;
const STROKE_WIDTH = 2;

const CENTER = SIZE / 2;
const RADIUS = CENTER - STROKE_WIDTH / 2;
/** Длина окружности */
const CIRCUMFERENCE = Math.PI * RADIUS * 2;

export const CountdownLoader: FC<Props> = ({ progress, className }) => {
    const value = Math.min(progress, 1);

    const strokeDasharray = CIRCUMFERENCE.toFixed(2);
    const strokeDashoffset = (value * CIRCUMFERENCE).toFixed(2);

    return (
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className={className}>
            <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                className={styles.circle}
            />
        </svg>
    );
};
