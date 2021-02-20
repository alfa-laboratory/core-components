import React, { cloneElement, forwardRef, isValidElement } from 'react';
import cn from 'classnames';

import { Modal, ModalProps } from './Component';
import { HeaderDesktop } from './components/header/Component.desktop';
import { ContentDesktop } from './components/content/Component.desktop';
import { FooterDesktop } from './components/footer/Component.desktop';
import { Closer } from './components/closer/Component';

import styles from './desktop.module.css';
import transitions from './transitions/content.module.css';

export type ModalDesktopProps = ModalProps & {
    /**
     * Ширина модального окна
     * @default "m"
     */
    size?: 's' | 'm' | 'l';

    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;
};

const ModalDesktopComponent = forwardRef<HTMLDivElement, ModalDesktopProps>(
    ({ size = 's', fullscreen, children, className, ...restProps }, ref) => (
        <Modal
            {...restProps}
            ref={ref}
            className={cn(styles.component, className, !fullscreen && styles[size])}
            hideBackdrop={fullscreen}
            fullscreen={fullscreen}
            transitionProps={{
                classNames: transitions,
                ...restProps.transitionProps,
            }}
        >
            {React.Children.map(children, child =>
                isValidElement(child)
                    ? cloneElement(child, { size: child.props.size || size })
                    : child,
            )}
        </Modal>
    ),
);

export const ModalDesktop = Object.assign(ModalDesktopComponent, {
    Content: ContentDesktop,
    Header: HeaderDesktop,
    Footer: FooterDesktop,
    Closer,
});
