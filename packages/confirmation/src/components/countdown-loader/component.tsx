import React, { FC, useEffect, useState } from 'react';

import styles from './index.module.css';

type Props = {
    duration: number;
    className: string;
};

const SIZE = 16;
const STROKE_WIDTH = 2;

const CENTER = SIZE / 2;
const RADIUS = CENTER - STROKE_WIDTH / 2;

/** Длина окружности */
const CIRCUMFERENCE = Math.PI * RADIUS * 2;
const STROKE_DASH_ARRAY = CIRCUMFERENCE.toFixed(2);

export const CountdownLoader: FC<Props> = ({ duration, className }) => {
    const [animationStarted, setAnimationStarted] = useState(false);

    useEffect(() => {
        setAnimationStarted(true);
    }, []);

    return (
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className={className}>
            <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                strokeDasharray={STROKE_DASH_ARRAY}
                strokeDashoffset={animationStarted ? STROKE_DASH_ARRAY : 0}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                className={styles.circle}
                style={{ transitionDuration: `${duration}ms` }}
            />
        </svg>
    );
};
