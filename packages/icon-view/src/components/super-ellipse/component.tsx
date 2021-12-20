import React, { FC } from 'react';
import cn from 'classnames';

import { getPath } from './paths';
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
    const imagePatternId = imageUrl && `${imageUrl.replace(/[^a-z]+/g, '')}_${size}`;

    const hasTopAddons = Boolean(topAddons);
    const hasBottomAddons = Boolean(bottomAddons);

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

    return (
        <div className={cn(styles.componentWrapper, styles[`size_${size}`], className)}>
            <div className={styles.component}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    xmlns='http://www.w3.org/2000/svg'
                >
                    {imagePattern}

                    <path
                        fill={imagePatternId ? `url(#${imagePatternId})` : backgroundColor}
                        d={getPath('shape', size, hasTopAddons, hasBottomAddons)}
                    />

                    {border && (
                        <path
                            className={styles.border}
                            d={getPath('border', size, hasTopAddons, hasBottomAddons)}
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
