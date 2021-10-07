import React, { useMemo } from 'react';
import { usePathBar } from '../hooks/usePathBar';

// eslint-disable-next-line complexity
const getPath = (
    x: number,
    width: number,
    height: number,
    initHeight: number,
    topRadius: number,
    bottomRadius: number,
    initY: number,
): string =>
    `
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

const RectBar = ({ fill, x, y, width, height, radius, background }: any): JSX.Element => {
    const [initHeight, topRadius, bottomRadius, initY]: any = usePathBar({
        radius,
        height,
        background,
        y,
    });

    const path = useMemo(
        () => (
            <path
                d={getPath(x, width, height, initHeight, topRadius, bottomRadius, initY)}
                stroke='none'
                fill={fill}
            />
        ),
        [x, width, height, initHeight, topRadius, bottomRadius, initY, fill],
    );

    return <React.Fragment>{path}</React.Fragment>;
};

export default React.memo(RectBar);
