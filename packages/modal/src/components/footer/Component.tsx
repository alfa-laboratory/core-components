import React, { FC, ReactNode, useContext, useEffect } from 'react';
import cn from 'classnames';

import { ModalContext } from '../../Context';

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

export const Footer: FC<FooterProps & { styles: Record<string, string> }> = ({
    children,
    className,
    sticky,
    styles,
}) => {
    const { footerHighlighted, setHasFooter } = useContext(ModalContext);

    useEffect(() => {
        setHasFooter(true);
    }, [setHasFooter]);

    return (
        <div
            className={cn(styles.footer, className, {
                [styles.highlighted]: sticky && footerHighlighted,
                [styles.sticky]: sticky,
            })}
        >
            {children}
        </div>
    );
};
