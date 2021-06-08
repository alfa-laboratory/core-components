import React, { FC } from 'react';
import cn from 'classnames';
import { Content, ContentProps } from './Component';

import styles from './desktop.module.css';

export type ContentDesktopProps = ContentProps & {
    /**
     * Размер
     */
    size?: 's' | 'm' | 'l';

    /**
     * Флаг, что модальное окно открыто на весь экран
     */
    fullscreen?: boolean;
};

export const ContentDesktop: FC<ContentDesktopProps> = ({
    size,
    className,
    fullscreen,
    ...restProps
}) => (
    <Content
        className={cn(className, size && styles[size], fullscreen && styles.fullscreen)}
        styles={styles}
        {...restProps}
    />
);
