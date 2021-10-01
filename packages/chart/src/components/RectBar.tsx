import React from 'react';
import { RadiusProp } from '../types/seria.types';

const getPath = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: RadiusProp | number = 0,
): string =>
    `
        M${x + (typeof radius === 'number' ? radius : radius?.bottomLeft || 0)} ${y + height}
        Q${x} ${y + height} ${x} ${y +
        height -
        (typeof radius === 'number' ? radius : radius?.bottomLeft || 0)}
        L${x} ${y + (typeof radius === 'number' ? radius : radius?.topLeft || 0)}
        Q${x} ${y} ${x + (typeof radius === 'number' ? radius : radius?.topLeft || 0)} ${y}
        L${x + width - (typeof radius === 'number' ? radius : radius?.topRight || 0)} ${y}
        Q${x + width} ${y} ${x + width} ${y +
        (typeof radius === 'number' ? radius : radius?.topRight || 0)}
        L${x + width} ${y +
        height -
        (typeof radius === 'number' ? radius : radius?.bottomRight || 0)}
        Q${x + width} ${y + height} ${x +
        width -
        (typeof radius === 'number' ? radius : radius?.bottomRight || 0)} ${y + height}
        Z
    `;

export const RectBar: React.FC<any> = (props): JSX.Element => {
    const { fill, x, y, width, height, radius } = props;
    return <path d={getPath(x, y, width, height, radius)} stroke='none' fill={fill} />;
};
