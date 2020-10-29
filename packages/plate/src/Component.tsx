import React, { forwardRef, useCallback, useState, ReactNode, MouseEvent } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type PlateProps = {
    /**
     * Управление наличием закрывающего крестика
     */
    hasCloser?: boolean;

    /**
     * Управление наличием стрелки скрытия контента
     */
    foldable?: boolean;

    /**
     * Начальное состояние контента при foldable={ true }
     */
    folded?: boolean;

    /**
     * Слот слева
     */
    leftAddons?: ReactNode;

    /**
     * Дочерние элементы
     */
    children?: ReactNode;

    /**
     * Заголовок компонента
     */
    title?: string;

    /**
     * Вид компонента
     */
    view?: 'common' | 'negative' | 'positive' | 'attention';

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Обработчик клика по плашке
     */
    onClick?: (event?: MouseEvent<HTMLDivElement>) => void;

    /**
     * Обработчик клика по крестику
     */
    onClose?: (event?: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Plate = forwardRef<HTMLInputElement, PlateProps>(
    (
        {
            hasCloser,
            foldable = false,
            folded = true,
            leftAddons,
            children,
            title,
            view = 'common',
            className,
            onClick,
            onClose,
            dataTestId,
        },
        ref,
    ) => {
        const [isHidden, setIsHidden] = useState(false);
        const [isFolded, setIsFolded] = useState(folded);

        const handleClick = useCallback(
            event => {
                if (foldable) {
                    setIsFolded(!isFolded);
                }

                if (onClick) {
                    onClick(event);
                }
            },
            [foldable, isFolded, onClick],
        );

        const handleClose = useCallback(
            event => {
                setIsHidden(true);

                if (onClose) {
                    onClose(event);
                }
            },
            [onClose],
        );

        return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <div
                className={cn(
                    styles.component,
                    styles[view],
                    {
                        [styles.isHidden]: hasCloser && isHidden,
                        [styles.hasCloser]: hasCloser,
                        [styles.foldable]: foldable,
                    },
                    className,
                )}
                onClick={handleClick}
                onKeyDown={handleClick}
                role='alert'
                ref={ref}
                data-test-id={dataTestId}
            >
                {leftAddons && <div className={cn(styles.leftAddons)}>{leftAddons}</div>}
                <div>
                    {title && <div className={cn(styles.title)}>{title}</div>}
                    <div
                        className={cn(
                            styles.content,
                            {
                                [styles.isFolded]: foldable && isFolded,
                            },
                            className,
                        )}
                    >
                        <div className={cn(styles.contentInner)}>{children}</div>
                    </div>
                </div>
                {(foldable || hasCloser) && (
                    <div className={cn(styles.additional)}>
                        {foldable && (
                            <div
                                className={cn(styles.folder, {
                                    [styles.isFolded]: foldable && isFolded,
                                })}
                            />
                        )}
                        {foldable ||
                            (hasCloser && (
                                <Button
                                    className={cn(styles.closer)}
                                    view='ghost'
                                    onClick={handleClose}
                                />
                            ))}
                    </div>
                )}
            </div>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Plate.defaultProps = {
    foldable: false,
    folded: true,
    view: 'common',
};
