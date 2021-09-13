import React from 'react';
import cn from 'classnames';
import { TickProps } from '../../types/utils/tick.type';

import styles from './index.module.css';

const Tick = (props: TickProps) => {
    const { y, payload, tickFormatter, xAxis } = props;
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
            <text className={cn(styles.tickText)} y='15' dy='0.71em'>
                {tickFormatter ? tickFormatter(payload.value) : payload.value}
            </text>
            <circle r={radius} fill='#0B1F35' opacity='0.3' />
        </g>
    );
};

export default Tick;
