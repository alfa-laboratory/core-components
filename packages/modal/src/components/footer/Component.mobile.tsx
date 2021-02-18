import React, { FC } from 'react';
import cn from 'classnames';
import { Footer, FooterProps } from './Component';

import styles from './mobile.module.css';

export type FooterMobileProps = FooterProps & {
    /**
     * Размер
     */
    size?: 's' | 'm';
};

export const FooterMobile: FC<FooterMobileProps> = ({ size, className, ...restProps }) => (
    <Footer className={cn(className, size && styles[size])} {...restProps} />
);
