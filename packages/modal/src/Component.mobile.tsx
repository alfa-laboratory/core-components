import React, { forwardRef } from 'react';
import cn from 'classnames';
import { useMedia } from '@alfalab/hooks';
import { Modal, ModalProps } from './Component';

import styles from './mobile.module.css';

export type ModalMobileProps = Omit<
    ModalProps,
    'fullscreen' | 'stickyFooter' | 'stickyHeader' | 'size'
>;

// FIXME: без явного указания типа возникает ts(4023)
export const ModalMobile = forwardRef<HTMLDivElement, ModalMobileProps>(
    ({ headerClassName, contentClassName, footerClassName, ...restProps }, ref) => {
        const [size] = useMedia(
            [
                ['s', '(max-width: 375px)'],
                ['m', '(min-width: 376px)'],
            ],
            's',
        );

        return (
            <Modal
                ref={ref}
                contentClassName={cn(styles[`content-${size}`], contentClassName)}
                footerClassName={cn(styles[`footer-${size}`], footerClassName)}
                headerClassName={cn(styles.header, styles[`header-${size}`], headerClassName)}
                hideBackdrop={true}
                {...restProps}
                stickyFooter={true}
                stickyHeader={true}
                fullscreen={true}
            />
        );
    },
);
