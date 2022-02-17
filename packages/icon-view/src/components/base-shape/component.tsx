import React, { forwardRef, ReactNode } from 'react';
import cn from 'classnames';

import { getPath, PathsMap } from './utils';

import styles from './index.module.css';

export type BaseShapeProps = {
    /**
     * Размер компонента
     */
    size?: number;

    /**
     * Цвет заливки
     * @default #f3f4f5
     */
    backgroundColor?: string;

    /**
     * Видимость обводки
     * @default false
     */
    border?: boolean;

    /**
     * Фоновое изображение. Имеет приоритет над иконкой и заливкой
     */
    imageUrl?: string;

    /**
     * Сss класс для стилизации общей обёртки
     */
    className?: string;

    /**
     * Слот сверху
     */
    topAddons?: ReactNode;

    /**
     * Слот снизу
     */
    bottomAddons?: ReactNode;

    /**
     * Фигуры
     */
    pathsMap: PathsMap;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const BaseShape = forwardRef<HTMLDivElement, BaseShapeProps>(
    (
        {
            size = 64,
            border = false,
            backgroundColor = 'var(--color-light-bg-secondary)',
            imageUrl,
            className,
            children,
            topAddons,
            bottomAddons,
            pathsMap,
            dataTestId,
        },
        ref,
    ) => {
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
            <div
                className={cn(styles.componentWrapper, styles[`size_${size}`], className)}
                ref={ref}
                data-test-id={dataTestId}
            >
                <div className={styles.component}>
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        xmlns='http://www.w3.org/2000/svg'
                        focusable={false}
                    >
                        {imagePattern}

                        <path
                            className={styles.bg}
                            style={{
                                fill: imagePatternId ? `url(#${imagePatternId})` : backgroundColor,
                            }}
                            d={getPath({
                                size,
                                hasTopAddons,
                                hasBottomAddons,
                                pathsMap: pathsMap.shape,
                            })}
                        />

                        {border && (
                            <path
                                className={styles.border}
                                d={getPath({
                                    size,
                                    hasTopAddons,
                                    hasBottomAddons,
                                    pathsMap: pathsMap.border,
                                })}
                            />
                        )}
                    </svg>

                    {!imageUrl && <div className={styles.children}>{children}</div>}
                </div>

                {hasTopAddons && (
                    <div className={cn(styles.addons, styles.topAddons)}>{topAddons}</div>
                )}

                {hasBottomAddons && (
                    <div className={cn(styles.addons, styles.bottomAddons)}>{bottomAddons}</div>
                )}
            </div>
        );
    },
);
