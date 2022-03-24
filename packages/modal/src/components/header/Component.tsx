import React, { FC, ReactNode, useContext, useEffect } from 'react';
import cn from 'classnames';

import { ModalContext } from '../../Context';

import styles from './index.module.css';

export type HeaderProps = {
    /**
     * Контент шапки
     */
    children?: ReactNode;

    /**
     * Слот слева
     */
    leftAddons?: ReactNode;

    /**
     * Компонент крестика
     */
    closer?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для аддонов
     */
    addonClassName?: string;

    /**
     * Дополнительный класс для контента
     */
    contentClassName?: string;

    /**
     * Заголовок шапки
     */
    title?: string;

    /**
     * Выравнивание заголовка
     */
    align?: 'left' | 'center';

    /**
     * Обрезать ли заголовок
     */
    trim?: boolean;

    /**
     * Фиксирует шапку
     */
    sticky?: boolean;
};

export const Header: FC<HeaderProps> = ({
    className,
    addonClassName,
    contentClassName,
    leftAddons,
    children,
    align = 'left',
    trim = true,
    title,
    closer,
    sticky,
}) => {
    const { headerHighlighted, setHasHeader } = useContext(ModalContext);

    const hasContent = title || Boolean(children);

    useEffect(() => {
        setHasHeader(true);
    }, [setHasHeader]);

    return (
        <div
            className={cn(styles.header, className, {
                [styles.highlighted]: hasContent && sticky && headerHighlighted,
                [styles.sticky]: sticky,
                [styles.hasContent]: hasContent,
            })}
        >
            {leftAddons && <div className={cn(styles.addon, addonClassName)}>{leftAddons}</div>}

            {hasContent && (
                <div
                    className={cn(styles.content, contentClassName, styles[align], {
                        [styles.trim]: trim,
                    })}
                >
                    {children}
                    {title && <div className={styles.title}>{title}</div>}
                </div>
            )}

            {closer && (
                <div className={cn(styles.addon, styles.closer, addonClassName)}>{closer}</div>
            )}
        </div>
    );
};
