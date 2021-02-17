import React, { ReactNode, useContext, useEffect } from 'react';
import cn from 'classnames';

import { ModalContext } from '../../Component';

import styles from './index.module.css';

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
     * Фиксирует футер
     */
    sticky?: boolean;
};

export const Footer: React.FC<FooterProps> = ({ children, className, sticky }) => {
    const { footerHighlighted, fullscreen, setHasFooter } = useContext(ModalContext);

    useEffect(() => {
        setHasFooter(true);
    }, [setHasFooter]);

    return (
        <div
            className={cn(styles.footer, className, {
                [styles.highlighted]: sticky && footerHighlighted,
                [styles.sticky]: sticky,
                [styles.fullscreen]: fullscreen,
            })}
        >
            {children}
        </div>
    );
};
