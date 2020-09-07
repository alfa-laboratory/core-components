import React, { FC, useState, useRef, useCallback, useEffect } from 'react';

import styles from './index.module.css';

type Props = {
    duration: number;
    className: string;
};

const SIZE = 16;

const RADIUS = SIZE / 2;

const FULL_TURN = Math.PI * 2;

export const CountdownLoader: FC<Props> = ({ duration, className }) => {
    const [angle, setAngle] = useState(0);

    const start = useRef(Date.now());
    const requestId = useRef(0);

    const updateProgress = useCallback(() => {
        const progress = (Date.now() - start.current) / duration;

        const newAngle = progress < 1 ? progress * FULL_TURN : FULL_TURN;

        setAngle(newAngle);

        if (progress < 1) {
            requestId.current = window.requestAnimationFrame(updateProgress);
        }
    }, [duration]);

    useEffect(() => {
        requestId.current = window.requestAnimationFrame(updateProgress);

        return () => {
            window.cancelAnimationFrame(requestId.current);
        };
    }, [updateProgress]);

    const x = RADIUS - RADIUS * Math.sin(angle);
    const y = RADIUS - RADIUS * Math.cos(angle);

    return (
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className={className}>
            <defs>
                <mask id='cut'>
                    <rect width='100%' height='100%' fill='white' />
                    <circle r={RADIUS * 0.75} cx={RADIUS} cy={RADIUS} fill='black' />
                    <path
                        d={`M${RADIUS} 0 V${RADIUS} L${x} ${y} ${
                            angle <= Math.PI ? 'H0' : `H${SIZE} V${SIZE} H0`
                        } L0 0 Z`}
                    />
                </mask>
            </defs>

            <circle cx={RADIUS} cy={RADIUS} r={RADIUS} mask='url(#cut)' className={styles.circle} />
        </svg>
    );
};
