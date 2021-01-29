import React, { ReactNode } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type FooterProps = {
    /**
     * Контент шапки
     */
    children?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Подсветка шапки
     */
    highlighted?: boolean;

    /**
     * Размер шапки
     */
    size?: 's' | 'm' | 'l';
};

export const Footer: React.FC<FooterProps> = ({ children, highlighted, size = 'm', className }) => (
    <div
        className={cn(styles.component, className, styles[size], {
            [styles.highlighted]: highlighted,
        })}
    >
        {children}
    </div>
);
