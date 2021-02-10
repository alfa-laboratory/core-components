import React, { ReactNode, useContext } from 'react';
import cn from 'classnames';

import styles from './index.module.css';
import { ModalContext } from '..';

export type FooterProps = {
    /**
     * Контент футера
     */
    children?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Размер футера
     */
    size?: 's' | 'm' | 'l';
};

export const Footer: React.FC<FooterProps> = ({ children, size, className }) => {
    const { footerHighlighted } = useContext(ModalContext);

    return (
        <div
            className={cn(styles.component, className, size && styles[size], {
                [styles.highlighted]: footerHighlighted,
            })}
        >
            {children}
        </div>
    );
};
