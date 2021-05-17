import React, { FC, ReactNode, useContext, useEffect } from 'react';
import cn from 'classnames';

import { ModalContext } from '../../Context';

import layoutStyles from './layout.module.css';

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

    /**
     * Выравнивание элементов футера
     */
    layout?: 'start' | 'center' | 'space-between' | 'row';

    /**
     * Отступы между элементами футера
     */
    gap?: 16 | 24 | 32;
};

export const Footer: FC<FooterProps & { styles: Record<string, string> }> = ({
    children,
    className,
    sticky,
    layout = 'start',
    gap,
    styles,
}) => {
    const { footerHighlighted, setHasFooter } = useContext(ModalContext);

    useEffect(() => {
        setHasFooter(true);
    }, [setHasFooter]);

    return (
        <div
            className={cn(
                styles.footer,
                className,
                layoutStyles[layout],
                gap && layoutStyles[`gap-${gap}`],
                {
                    [styles.highlighted]: sticky && footerHighlighted,
                    [styles.sticky]: sticky,
                },
            )}
        >
            {children}
        </div>
    );
};
