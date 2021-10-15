import React from 'react';
import { usePathBar } from '../hooks/usePathBar';

export const CustomizedLabel: React.FC<any> = ({
    x,
    y,
    value,
    offset,
    radius,
    height,
    width,
    formatter,
}) => {
    const [initHeight] = usePathBar({ radius, height });

    return (
        <text
            x={x + width / 2}
            y={y + height - (initHeight + offset)}
            width={width}
            height={initHeight}
            textAnchor='middle'
        >
            <tspan x={x + width / 2}>{formatter ? formatter(value) : value}</tspan>
        </text>
    );
};
