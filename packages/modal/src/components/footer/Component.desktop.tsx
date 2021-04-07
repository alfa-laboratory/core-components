import React, { FC } from 'react';
import cn from 'classnames';
import { Footer, FooterProps } from './Component';

import styles from './desktop.module.css';

export type FooterDesktopProps = FooterProps & {
    /**
     * Размер
     */
    size?: 's' | 'm' | 'l';

    /**
     * Флаг, что модальное окно открыто на весь экран
     */
    fullscreen?: boolean;
};

export const FooterDesktop: FC<FooterDesktopProps> = ({
    size,
    className,
    fullscreen,
    ...restProps
}) => (
    <Footer
        className={cn(className, size && styles[size], fullscreen && styles.fullscreen)}
        styles={styles}
        {...restProps}
    />
);
