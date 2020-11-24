import React, { forwardRef, useCallback, useState, ReactNode, MouseEvent, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useFocus } from '@alfalab/hooks';
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
    defaultFolded?: boolean;

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

export const Plate = forwardRef<HTMLDivElement, PlateProps>(
    (
        {
            hasCloser,
            foldable = false,
            defaultFolded = true,
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
        const plateRef = useRef<HTMLDivElement>(null);

        const [focused] = useFocus(plateRef, 'keyboard');

        const [isHidden, setIsHidden] = useState(false);
        const [isFolded, setIsFolded] = useState(defaultFolded);

        const isFoldable = !!title && !!children && foldable;

        const handleClick = useCallback(
            event => {
                if (isFoldable) {
                    setIsFolded(!isFolded);
                }

                if (onClick) {
                    onClick(event);
                }
            },
            [isFoldable, isFolded, onClick],
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
                        [styles.focused]: focused,
                        [styles.isHidden]: hasCloser && isHidden,
                        [styles.hasCloser]: hasCloser,
                        [styles.foldable]: isFoldable,
                        [styles.isFolded]: isFoldable && isFolded,
                    },
                    className,
                )}
                onClick={handleClick}
                onKeyDown={handleClick}
                role='alert'
                ref={mergeRefs([plateRef, ref])}
                /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
                tabIndex={isFoldable ? 0 : -1}
                data-test-id={dataTestId}
            >
                {leftAddons && <div className={cn(styles.leftAddons)}>{leftAddons}</div>}
                <div
                    className={cn(styles.contentContainer, {
                        [styles.withoutTitle]: !title,
                    })}
                >
                    {title && <div className={cn(styles.title)}>{title}</div>}
                    {children && (
                        <div
                            className={cn(styles.content, {
                                [styles.isFolded]: isFoldable && isFolded,
                            })}
                        >
                            <div className={cn(styles.contentInner)}>{children}</div>
                        </div>
                    )}
                </div>
                {(foldable || hasCloser) && (
                    <div className={cn(styles.additional)}>
                        {isFoldable && (
                            <div
                                className={cn(styles.folder, {
                                    [styles.isFolded]: isFolded,
                                })}
                            />
                        )}
                        {isFoldable ||
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
    defaultFolded: true,
    view: 'common',
};
