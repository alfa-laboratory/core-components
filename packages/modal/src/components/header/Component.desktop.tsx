import React, { FC } from 'react';
import cn from 'classnames';
import { Header, HeaderProps } from './Component';

import styles from './desktop.module.css';

export type HeaderDesktopProps = HeaderProps & {
    /**
     * Размер
     */
    size?: 's' | 'm' | 'l';

    /**
     * Флаг, что модальное окно открыто на весь экран
     */
    fullscreen?: boolean;
};

export const HeaderDesktop: FC<HeaderDesktopProps> = ({
    size,
    className,
    fullscreen,
    ...restProps
}) => (
    <Header
        className={cn(className, size && styles[size], fullscreen && styles.fullscreen)}
        styles={styles}
        {...restProps}
    />
);
