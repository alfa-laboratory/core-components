import React, { FC, ReactNode, useContext, useEffect } from 'react';
import cn from 'classnames';

import { BaseModalContext } from '@alfalab/core-components-base-modal';

import styles from './index.module.css';

export type FooterProps = {
    /**
     * Контент футера
     */
    children?: ReactNode;

    /**
     * Фиксирует футер
     */
    sticky?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;
};

export const Footer: FC<FooterProps> = ({ children, className, sticky }) => {
    const { footerHighlighted, setHasFooter } = useContext(BaseModalContext);

    useEffect(() => {
        setHasFooter(true);
    }, [setHasFooter]);

    return (
        <div
            className={cn(styles.footer, className, {
                [styles.sticky]: sticky,
                [styles.highlighted]: footerHighlighted && sticky,
            })}
        >
            {children}
        </div>
    );
};
