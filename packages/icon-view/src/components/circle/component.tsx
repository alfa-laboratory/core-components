import React, { FC, useMemo } from 'react';
import cn from 'classnames';

import { getClipPath, getBorderPath } from './paths';
import { ShapeProps } from '../../types';

import styles from './index.module.css';

export const Circle: FC<ShapeProps> = ({
    size = '64',
    border = false,
    backgroundColor = '#f3f4f5',
    imageUrl,
    className,
    children,
    topAddons,
    bottomAddons,
}) => {
    const hasTopAddons = Boolean(topAddons);
    const hasBottomAddons = Boolean(bottomAddons);
    const hasMask = hasTopAddons || hasBottomAddons;

    const maskId = useMemo(
        () =>
            cn('core-components-mask', 'circle', size, {
                'top-addons': hasTopAddons,
                'bottom-addons': hasBottomAddons,
            })
                .split(' ')
                .join('_'),
        [size, hasTopAddons, hasBottomAddons],
    );

    const mask = hasMask && (
        <defs>
            <clipPath id={maskId}>
                <path fill='white' d={getClipPath(size, hasTopAddons, hasBottomAddons)} />
            </clipPath>
        </defs>
    );

    return (
        <div className={cn(styles.componentWrapper, styles[`size_${size}`], className)}>
            <div
                className={cn(styles.component, { [styles.withCssBorder]: border && !hasMask })}
                style={{ clipPath: hasMask ? `url(#${maskId})` : '', backgroundColor }}
            >
                {imageUrl ? (
                    <div className={styles.img} style={{ backgroundImage: `url(${imageUrl})` }} />
                ) : (
                    <div className={styles.children}>{children}</div>
                )}

                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    xmlns='http://www.w3.org/2000/svg'
                    className={styles.svg}
                >
                    {mask}

                    {border && (
                        <path
                            d={getBorderPath(size, hasTopAddons, hasBottomAddons)}
                            className={styles.border}
                            fill='transparent'
                        />
                    )}
                </svg>
            </div>

            {hasTopAddons && <div className={cn(styles.addons, styles.topAddons)}>{topAddons}</div>}

            {hasBottomAddons && (
                <div className={cn(styles.addons, styles.bottomAddons)}>{bottomAddons}</div>
            )}
        </div>
    );
};
