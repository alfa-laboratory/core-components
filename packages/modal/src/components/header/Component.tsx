import React, { MouseEvent, ReactNode } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type HeaderProps = {
    /**
     * Контент шапки
     */
    children?: ReactNode;

    /**
     * Наличие крестика
     */
    hasCloser?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Подсветка шапки
     */
    highlighted?: boolean;

    /**
     * Размер шапки
     */
    size?: 's' | 'm' | 'l';

    /**
     * Обработчик нажатия на крестик
     */
    onCloserClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const Header: React.FC<HeaderProps> = ({
    children,
    hasCloser,
    highlighted,
    onCloserClick,
    size,
    className,
}) => {
    if (!children && !hasCloser) return null;

    return (
        <div
            className={cn(styles.component, className, size && styles[size], {
                [styles.highlighted]: highlighted,
                [styles.onlyCloser]: hasCloser && !children,
            })}
        >
            {children && (
                <div
                    className={cn(styles.content, {
                        [styles.withTitle]: typeof children === 'string',
                    })}
                >
                    {children}
                </div>
            )}

            {hasCloser && (
                <Button
                    type='button'
                    view='ghost'
                    className={cn(styles.closer)}
                    aria-label='закрыть'
                    onClick={onCloserClick}
                />
            )}
        </div>
    );
};
