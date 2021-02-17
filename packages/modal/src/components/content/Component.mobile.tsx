import React from 'react';
import cn from 'classnames';
import { Content, ContentProps } from './Component';

import styles from './mobile.module.css';

export type ContentMobileProps = ContentProps & {
    /**
     * Размер
     */
    size?: 's' | 'm';
};

export const ContentMobile: React.FC<ContentMobileProps> = ({ size, className, ...restProps }) => (
    <Content className={cn(className, size && styles[size])} {...restProps} />
);
