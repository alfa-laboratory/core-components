import React from 'react';

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
    const topRadius =
        radius?.top && height / 2 < radius.top ? Math.ceil(height / 2) : radius?.top || 0;
    const bottomRadius =
        radius?.bottom && height / 2 < radius.bottom ? Math.ceil(height / 2) : radius?.bottom || 0;
    const checkHeight =
        (radius && height !== 0 && height / 2 < (radius?.top || 0)) ||
        height / 2 < (radius?.bottom || 0);
    // eslint-disable-next-line no-nested-ternary
    const initHeight = checkHeight
        ? (topRadius || bottomRadius) && topRadius + bottomRadius
        : height > 0 && height < 2
        ? 2
        : height;

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
