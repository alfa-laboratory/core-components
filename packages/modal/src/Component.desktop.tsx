import React, { forwardRef } from 'react';

import { Modal, ModalProps } from './Component';

export type ModalDesktopProps = ModalProps;

export const ModalDesktop = forwardRef<HTMLDivElement, ModalDesktopProps>(
    ({ size = 's', hasCloser, headerTitle, ...restProps }, ref) => (
        <Modal
            ref={ref}
            size={size}
            hasCloser={hasCloser}
            headerTitle={headerTitle}
            disableHeaderHightlight={hasCloser && !headerTitle}
            {...restProps}
        />
    ),
);
