import React, { FC } from 'react';
import { ToastPlate, ToastPlateProps } from '@alfalab/core-components-toast-plate';
import { Popover, PopoverProps } from '@alfalab/core-components-popover';

export type ToastProps = {
    popoverProps: PopoverProps;
    toastPlateProps: ToastPlateProps;
};

export const Toast: FC<ToastProps> = ({ toastPlateProps, popoverProps }) => {
    return (
        <Popover {...popoverProps}>
            <ToastPlate {...toastPlateProps} />
        </Popover>
    );
};
