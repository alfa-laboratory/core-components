import React, { FC, ReactNode, useContext, useEffect } from 'react';
import cn from 'classnames';

import { ModalContext } from '../../Context';

import { Closer } from '../closer/Component';

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
     * Заголовок шапки
     */
    title?: string;

    /**
     * Фиксирует шапку
     */
    sticky?: boolean;
};

export const Header: FC<HeaderProps & { styles: Record<string, string> }> = ({
    className,
    children,
    title,
    hasCloser = true,
    sticky,
    styles,
}) => {
    const { headerHighlighted, setHasHeader } = useContext(ModalContext);

    const hasContent = title || Boolean(children);

    useEffect(() => {
        setHasHeader(true);
    }, [setHasHeader]);

    return (
        <div
            className={cn(styles.header, className, {
                [styles.highlighted]: sticky && headerHighlighted,
                [styles.sticky]: sticky,
            })}
        >
            {hasContent && (
                <div className={styles.content}>
                    {children}
                    {title && <div className={styles.title}>{title}</div>}
                </div>
            )}

            {hasCloser && <Closer />}
        </div>
    );
};
