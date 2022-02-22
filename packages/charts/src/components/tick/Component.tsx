import React from 'react';
import cn from 'classnames';
import { TickProps } from '../../types/utils/tick.types';

import styles from './index.module.css';

export const Tick = ({ y, payload, tickFormatter, xAxis }: TickProps) => {
    const radius = 4;

    const marginTick =
        xAxis?.tickMargin &&
        (xAxis.tickMargin > 0 ? xAxis.tickMargin - radius / 2 : xAxis.tickMargin === 0)
            ? (radius / 2) * -1
            : null;

    return (
        <g
            className={cn(styles.tick)}
            opacity='1'
            textAnchor='middle'
            transform={`translate(${payload.coordinate}, ${y -
                (typeof marginTick === 'number' ? marginTick : 0) -
                radius * 2})`}
        >
            <text className={cn(styles.tickText)} y='30'>
                {tickFormatter ? tickFormatter(payload.value) : payload.value}
            </text>
            <circle r={radius} className={cn(styles.circle)} />
        </g>
    );
};
