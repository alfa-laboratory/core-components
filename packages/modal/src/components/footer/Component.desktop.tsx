import React from 'react';
import cn from 'classnames';
import { Footer, FooterProps } from './Component';

import styles from './desktop.module.css';

export type FooterDesktopProps = FooterProps & {
    /**
     * Размер
     */
    size?: 's' | 'm' | 'l';
};

export const FooterDesktop: React.FC<FooterDesktopProps> = ({ size, className, ...restProps }) => (
    <Footer className={cn(className, styles.footer, size && styles[size])} {...restProps} />
);
