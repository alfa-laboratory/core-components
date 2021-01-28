import React, { forwardRef, FC, RefAttributes } from 'react';

import { Modal, ModalProps } from './Component';

export type ModalDesktopProps = ModalProps;

// FIXME: без явного указания типа возникает ts(4023)
export const ModalDesktop: FC<ModalDesktopProps & RefAttributes<HTMLDivElement>> = forwardRef<
    HTMLDivElement,
    ModalDesktopProps
>(({ size = 's', ...restProps }, ref) => <Modal ref={ref} size={size} {...restProps} />);
