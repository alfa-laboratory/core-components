import React, { ReactNode, useContext, useEffect } from 'react';
import cn from 'classnames';

import { Closer } from '../closer/Component';
import { ModalContext } from '../../Component';

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
     * Фиксирует шапку
     */
    sticky?: boolean;
};

export const Header: React.FC<HeaderProps> = ({
    className,
    children,
    hasCloser = true,
    sticky,
}) => {
    const { headerHighlighted, setHasHeader, fullscreen } = useContext(ModalContext);

    useEffect(() => {
        setHasHeader(true);
    }, [setHasHeader]);

    return (
        <div
            className={cn(styles.header, className, {
                [styles.highlighted]: sticky && headerHighlighted,
                [styles.onlyCloser]: hasCloser && !children,
                [styles.sticky]: sticky,
                [styles.fullscreen]: fullscreen,
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

            {hasCloser && <Closer />}
        </div>
    );
};
