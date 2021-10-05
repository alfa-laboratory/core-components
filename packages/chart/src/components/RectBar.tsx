import React from 'react';
import { RadiusProp } from '../types/seria.types';

type BackgroundProps = {
    height: number;
    width: number;
    x: number;
    y: number;
};

// eslint-disable-next-line complexity
const getPath = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: RadiusProp,
    background: BackgroundProps,
): string => {
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
        ? -2
        : height;
    const initY = checkHeight ? background.height + background.y - (topRadius + bottomRadius) : y;

    return `
            M${x + ((height !== 0 && bottomRadius) || 0)} ${initY + initHeight || 0}
            Q${x} ${initY + initHeight} ${x} ${initY +
        initHeight -
        ((height !== 0 && bottomRadius) || 0)}
            L${x} ${initY + ((height !== 0 && topRadius) || 0)}
            Q${x} ${initY} ${x + ((height !== 0 && topRadius) || 0)} ${initY}
            L${x + width - ((height !== 0 && topRadius) || 0)} ${initY}
            Q${x + width} ${initY} ${x + width} ${initY + (topRadius || 0)}
            L${x + width} ${initY + initHeight - ((height !== 0 && bottomRadius) || 0)}
            Q${x + width} ${initY + initHeight} ${x +
        width -
        ((height !== 0 && bottomRadius) || 0)} ${initY + initHeight}
            Z
        `;
};

export const RectBar: React.FC<any> = ({
    fill,
    x,
    y,
    width,
    height,
    radius,
    background,
}): JSX.Element => (
    <path d={getPath(x, y, width, height, radius, background)} stroke='none' fill={fill} />
);
