import React, { cloneElement, forwardRef, isValidElement } from 'react';
import { useMedia } from '@alfalab/hooks';

import { Modal, ModalProps } from './Component';
import { HeaderMobile } from './components/header/Component.mobile';
import { ContentMobile } from './components/content/Component.mobile';
import { FooterMobile } from './components/footer/Component.mobile';
import { Closer } from './components/closer/Component';

import transitions from './transitions/content.module.css';

export type ModalMobileProps = Omit<ModalProps, 'fullscreen' | 'size'> & {
    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;
};

const ModalMobileComponent = forwardRef<HTMLDivElement, ModalMobileProps>(
    ({ children, ...restProps }, ref) => {
        const [size] = useMedia(
            [
                ['s', '(max-width: 375px)'],
                ['m', '(min-width: 376px)'],
            ],
            's',
        );

        return (
            <Modal
                {...restProps}
                ref={ref}
                transitionProps={{
                    classNames: transitions,
                    ...restProps.transitionProps,
                }}
                hideBackdrop={true}
                fullscreen={true}
            >
                {React.Children.map(children, child =>
                    isValidElement(child)
                        ? cloneElement(child, { size: child.props.size || size })
                        : child,
                )}
            </Modal>
        );
    },
);

export const ModalMobile = Object.assign(ModalMobileComponent, {
    Content: ContentMobile,
    Header: HeaderMobile,
    Footer: FooterMobile,
    Closer,
});
