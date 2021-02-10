import React, { ReactNode, useCallback, useContext } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';
import { ModalContext } from '../base-modal';

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
     * Размер шапки
     */
    size?: 's' | 'm' | 'l';
};

export const Header: React.FC<HeaderProps> = ({ children, hasCloser, size, className }) => {
    const { headerHighlighted, onClose } = useContext(ModalContext);

    const handleCloserClick = useCallback(
        event => {
            onClose(event, 'closerClick');
        },
        [onClose],
    );

    if (!children && !hasCloser) return null;

    return (
        <div
            className={cn(styles.component, className, size && styles[size], {
                [styles.highlighted]: headerHighlighted,
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
                    onClick={handleCloserClick}
                />
            )}
        </div>
    );
};
