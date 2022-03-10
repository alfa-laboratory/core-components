import React, { FC } from 'react';
import cn from 'classnames';
import { Header, HeaderProps } from './Component';
import { Closer } from '../closer/Component';
import { ModalDesktopProps } from '../../Component.desktop';

import styles from './desktop.module.css';

export type HeaderDesktopProps = Omit<HeaderProps, 'closer'> & {
    /**
     * Размер
     */
    size?: ModalDesktopProps['size'];

    /**
     * Наличие крестика
     */
    hasCloser?: boolean;
};

export const HeaderDesktop: FC<HeaderDesktopProps> = ({
    size,
    className,
    contentClassName,
    hasCloser = true,
    sticky,
    leftAddons = <span />,
    title,
    children,
    ...restProps
}) => {
    const hasContent = title || Boolean(children);
    return (
        <Header
            className={cn(className, styles.header, size && styles[size], {
                [styles.sticky]: sticky,
                [styles.hasContent]: hasContent,
            })}
            contentClassName={cn(styles.content, contentClassName)}
            closer={hasCloser ? <Closer /> : null}
            leftAddons={leftAddons}
            sticky={sticky}
            title={title}
            {...restProps}
        >
            {children}
        </Header>
    );
};
