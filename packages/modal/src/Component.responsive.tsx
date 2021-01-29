import { useMedia } from '@alfalab/hooks';
import React, { forwardRef } from 'react';
import { ModalDesktop, ModalDesktopProps } from './Component.desktop';
import { ModalMobile, ModalMobileProps } from './Component.mobile';

export type ModalResponsiveProps = ModalMobileProps | ModalDesktopProps;

export const ModalResponsive = forwardRef<HTMLDivElement, ModalResponsiveProps>((props, ref) => {
    const [Component] = useMedia(
        [
            [ModalMobile, '(max-width: 767px)'],
            [ModalDesktop, '(min-width: 768px)'],
        ],
        ModalDesktop,
    );

    return <Component ref={ref} {...props} />;
});
