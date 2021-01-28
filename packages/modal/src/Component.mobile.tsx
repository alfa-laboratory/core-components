import React, { forwardRef, FC, RefAttributes } from 'react';
import cn from 'classnames';

import { useMedia } from '@alfalab/hooks';
import { Modal, ModalProps } from './Component';

import styles from './mobile.module.css';

export type ModalMobileProps = Omit<
    ModalProps,
    'fullscreen' | 'stickyFooter' | 'stickyHeader' | 'size'
>;

// FIXME: без явного указания типа возникает ts(4023)
export const ModalMobile: FC<ModalMobileProps & RefAttributes<HTMLDivElement>> = forwardRef<
    HTMLDivElement,
    ModalMobileProps
>(
    (
        {
            className,
            headerClassName,
            contentClassName,
            footerClassName,
            closerClassName,
            ...restProps
        },
        ref,
    ) => {
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
                className={cn(styles.component, className)}
                contentClassName={cn(styles[`content-${size}`], contentClassName)}
                footerClassName={cn(styles[`footer-${size}`], footerClassName)}
                headerClassName={cn(styles.header, styles[`header-${size}`], headerClassName)}
                closerClassName={cn(styles.closer, closerClassName)}
                hideBackdrop={true}
                transparentHeader={false}
                {...restProps}
                stickyFooter={true}
                stickyHeader={true}
                fullscreen={true}
                size={undefined}
            />
        );
    },
);
