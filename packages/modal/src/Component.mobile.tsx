import React, { cloneElement, forwardRef, isValidElement } from 'react';
import cn from 'classnames';
import { useMedia } from '@alfalab/hooks';

import { BaseModal, BaseModalProps } from '@alfalab/core-components-base-modal';

import { HeaderMobile } from './components/header/Component.mobile';
import { ContentMobile } from './components/content/Component.mobile';
import { FooterMobile } from './components/footer/Component.mobile';
import { Closer } from './components/closer/Component';

import styles from './mobile.module.css';
import transitions from './transitions.module.css';

export type ModalMobileProps = BaseModalProps & {
    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;
};

const ModalMobileComponent = forwardRef<HTMLDivElement, ModalMobileProps>(
    ({ children, className, ...restProps }, ref) => {
        const [size] = useMedia(
            [
                ['s', '(max-width: 375px)'],
                ['m', '(min-width: 376px)'],
            ],
            's',
        );

        return (
            <BaseModal
                {...restProps}
                ref={ref}
                transitionProps={{
                    classNames: transitions,
                    ...restProps.transitionProps,
                }}
                className={cn(className, styles.component)}
                backdropProps={{
                    invisible: true,
                }}
            >
                {React.Children.map(children, child =>
                    isValidElement(child)
                        ? cloneElement(child, { size: child.props.size || size, fullscreen: true })
                        : child,
                )}
            </BaseModal>
        );
    },
);

export const ModalMobile = Object.assign(ModalMobileComponent, {
    Content: ContentMobile,
    Header: HeaderMobile,
    Footer: FooterMobile,
    Closer,
});
