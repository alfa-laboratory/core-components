import React, { forwardRef } from 'react';

import { Modal, ModalProps } from './Component';

export type ModalDesktopProps = ModalProps;

export const ModalDesktop = forwardRef<HTMLDivElement, ModalDesktopProps>(
    ({ size = 's', hasCloser, headerContent, fullscreen, ...restProps }, ref) => (
        <Modal
            ref={ref}
            size={size}
            hasCloser={hasCloser}
            headerContent={headerContent}
            hideBackdrop={fullscreen}
            fullscreen={fullscreen}
            {...restProps}
        />
    ),
);
