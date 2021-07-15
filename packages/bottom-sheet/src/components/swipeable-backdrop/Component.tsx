import React, { FC } from 'react';

import { Backdrop, BackdropProps } from '@alfalab/core-components-backdrop';
import { SwipeableHandlers } from 'react-swipeable/types';

export type SwipeableBackdropProps = BackdropProps & {
    /**
     * Прозрачность бэкдропа
     */
    opacity?: number;

    /**
     * Обработчики свайпа
     */
    handlers?: SwipeableHandlers;

    /**
     * Время анимации opacity
     */
    opacityTimeout?: number;
};

export const SwipeableBackdrop: FC<SwipeableBackdropProps> = ({
    opacity,
    handlers,
    opacityTimeout,
    ...backdropProps
}) => (
    <div
        {...handlers}
        style={{
            opacity,
            transition: opacity === 1 ? `opacity ${opacityTimeout}ms ease-in-out` : '',
        }}
    >
        <Backdrop {...backdropProps} />
    </div>
);
