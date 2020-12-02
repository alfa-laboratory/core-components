import React, { FC } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type Props = {
    progress: number; // 0-1
    className: string;
};

const SIZE = 16;

const RADIUS = SIZE / 2;

const FULL_TURN = Math.PI * 2;

export const CountdownLoader: FC<Props> = ({ progress, className }) => {
    const angle = progress < 1 ? progress * FULL_TURN : FULL_TURN;

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

            <circle
                cx={RADIUS}
                cy={RADIUS}
                r={RADIUS}
                mask='url(#cut)'
                className={cn(styles.circle)}
            />
        </svg>
    );
};
