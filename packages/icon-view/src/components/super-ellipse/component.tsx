import React, { FC, useMemo } from 'react';
import cn from 'classnames';

import { getClipPath, shapes, getBorderPath } from './paths';
import { ShapeProps } from '../../types';

import styles from './index.module.css';

export const SuperEllipse: FC<ShapeProps> = ({
    size = '64',
    border = false,
    backgroundColor = '#f3f4f5',
    imageUrl,
    className,
    children,
    topAddons,
    bottomAddons,
}) => {
    const shapePath = shapes[size];

    const imagePatternId = imageUrl && `${imageUrl.replace(/[^a-z]+/g, '')}_${size}`;

    const hasTopAddons = Boolean(topAddons);
    const hasBottomAddons = Boolean(bottomAddons);
    const hasMask = hasTopAddons || hasBottomAddons;

    const maskId = useMemo(
        () =>
            cn('core-components-mask', 'super-ellipse', size, {
                'top-addons': hasTopAddons,
                'bottom-addons': hasBottomAddons,
            })
                .split(' ')
                .join('_'),
        [size, hasTopAddons, hasBottomAddons],
    );

    const imagePattern = imagePatternId && (
        <defs>
            <pattern id={imagePatternId} width='100%' height='100%'>
                <image
                    href={imageUrl}
                    width='100%'
                    height='100%'
                    preserveAspectRatio='xMidYMid slice'
                />
            </pattern>
        </defs>
    );

    const mask = hasMask && (
        <defs>
            <clipPath id={maskId}>
                <path d={getClipPath(size, hasTopAddons, hasBottomAddons)} />
            </clipPath>
        </defs>
    );

    return (
        <div className={cn(styles.componentWrapper, styles[`size_${size}`], className)}>
            <div
                className={styles.component}
                style={{ clipPath: hasMask ? `url(#${maskId})` : '' }}
            >
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    xmlns='http://www.w3.org/2000/svg'
                >
                    {imagePattern}

                    {mask}

                    <path
                        d={shapePath}
                        fill={imagePatternId ? `url(#${imagePatternId})` : backgroundColor}
                    />

                    {border && (
                        <path
                            d={getBorderPath(size, hasTopAddons, hasBottomAddons)}
                            className={styles.border}
                            fill='transparent'
                        />
                    )}
                </svg>

                {!imageUrl && <div className={styles.children}>{children}</div>}
            </div>

            {hasTopAddons && <div className={cn(styles.addons, styles.topAddons)}>{topAddons}</div>}

            {hasBottomAddons && (
                <div className={cn(styles.addons, styles.bottomAddons)}>{bottomAddons}</div>
            )}
        </div>
    );
};
