import React, { FC } from 'react';
import cn from 'classnames';
import { Header, HeaderProps } from './Component';
import { Closer } from '../closer/Component';

import styles from './desktop.module.css';

export type HeaderDesktopProps = Omit<HeaderProps, 'closer'> & {
    /**
     * Размер
     */
    size?: 's' | 'm' | 'l';

    /**
     * Флаг, что модальное окно открыто на весь экран
     */
    fullscreen?: boolean;

    /**
     * Наличие крестика
     */
    hasCloser?: boolean;
};

export const HeaderDesktop: FC<HeaderDesktopProps> = ({
    size,
    className,
    contentClassName,
    fullscreen,
    hasCloser,
    sticky,
    ...restProps
}) => (
    <Header
        className={cn(className, styles.header, size && styles[size], {
            [styles.fullscreen]: fullscreen,
            [styles.sticky]: sticky,
        })}
        contentClassName={cn(styles.content, contentClassName)}
        closer={hasCloser ? <Closer /> : null}
        sticky={sticky}
        {...restProps}
    />
);
