import React from 'react';
import cn from 'classnames';
import { Header, HeaderProps } from './Component';

import styles from './desktop.module.css';

export type HeaderDesktopProps = HeaderProps & {
    /**
     * Размер
     */
    size?: 's' | 'm' | 'l';
};

export const HeaderDesktop: React.FC<HeaderDesktopProps> = ({ size, className, ...restProps }) => (
    <Header className={cn(className, styles.header, size && styles[size])} {...restProps} />
);
