import React, { cloneElement, forwardRef, isValidElement } from 'react';
import cn from 'classnames';

import { BaseModal, BaseModalProps } from '@alfalab/core-components-base-modal';
import { HeaderDesktop } from './components/header/Component.desktop';
import { ContentDesktop } from './components/content/Component.desktop';
import { FooterDesktop } from './components/footer/Component.desktop';
import { Closer } from './components/closer/Component';

import styles from './desktop.module.css';
import transitions from './transitions.module.css';

export type ModalDesktopProps = BaseModalProps & {
    /**
     * Ширина модального окна
     * @default "m"
     */
    size?: 's' | 'm' | 'l';

    /**
     * Растягивает модальное окно на весь экран
     */
    fullscreen?: boolean;

    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;
};

const ModalDesktopComponent = forwardRef<HTMLDivElement, ModalDesktopProps>(
    ({ size = 's', fullscreen, children, className, wrapperClassName, ...restProps }, ref) => (
        <BaseModal
            {...restProps}
            ref={ref}
            wrapperClassName={cn(styles.wrapper, wrapperClassName, {
                [styles.fullscreen]: fullscreen,
            })}
            className={cn(styles.component, className, !fullscreen && styles[size])}
            backdropProps={{
                invisible: fullscreen,
            }}
            transitionProps={{
                classNames: transitions,
                ...restProps.transitionProps,
            }}
        >
            {React.Children.map(children, child =>
                isValidElement(child)
                    ? cloneElement(child, { size: child.props.size || size, fullscreen })
                    : child,
            )}
        </BaseModal>
    ),
);

export const ModalDesktop = Object.assign(ModalDesktopComponent, {
    Content: ContentDesktop,
    Header: HeaderDesktop,
    Footer: FooterDesktop,
    Closer,
});
