import React, { useMemo } from 'react';
import cn from 'classnames';
import { usePathBar } from '../../hooks';

import styles from './index.module.css';

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

export const RectBar = (props: any): JSX.Element => {
    const {
        fill,
        x,
        y,
        width,
        height,
        radius,
        background,
        activeDotsState,
        index,
        unfocusedAnimation,
    } = props;
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
                className={cn(
                    styles.bar,
                    typeof activeDotsState.active === 'number' &&
                        unfocusedAnimation &&
                        activeDotsState.active !== index
                        ? styles.unfocused
                        : '',
                )}
            />
        ),
        [
            x,
            width,
            height,
            initHeight,
            topRadius,
            bottomRadius,
            initY,
            fill,
            activeDotsState.active,
            unfocusedAnimation,
            index,
        ],
    );

    return <React.Fragment>{path}</React.Fragment>;
};
