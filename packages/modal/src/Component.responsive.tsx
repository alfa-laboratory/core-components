import { useMedia } from '@alfalab/hooks';
import React, { forwardRef, FC, RefAttributes } from 'react';

import { ModalDesktop, ModalDesktopProps } from './Component.desktop';
import { ModalMobile, ModalMobileProps } from './Component.mobile';

export type ModalResponsiveProps = ModalMobileProps | ModalDesktopProps;

// FIXME: без явного указания типа возникает ts(4023)
export const ModalResponsive: FC<ModalResponsiveProps & RefAttributes<HTMLDivElement>> = forwardRef<
    HTMLDivElement,
    ModalResponsiveProps
>((props, ref) => {
    const [Component] = useMedia(
        [
            [ModalMobile, '(max-width: 767px)'],
            [ModalDesktop, '(min-width: 768px)'],
        ],
        ModalDesktop,
    );

    return <Component ref={ref} {...props} />;
});
