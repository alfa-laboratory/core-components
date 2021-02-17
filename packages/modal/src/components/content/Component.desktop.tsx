import React from 'react';
import cn from 'classnames';
import { Content, ContentProps } from './Component';

import styles from './desktop.module.css';

export type ContentDesktopProps = ContentProps & {
    /**
     * Размер
     */
    size?: 's' | 'm' | 'l';
};

export const ContentDesktop: React.FC<ContentDesktopProps> = ({
    size,
    className,
    ...restProps
}) => <Content className={cn(className, size && styles[size])} {...restProps} />;
