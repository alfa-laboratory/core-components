import React, { cloneElement, ReactElement, FC, useCallback, useMemo } from 'react';
import cn from 'classnames';

import {
    NotificationProps as CoreNotificationProps,
    Notification as CoreNotification,
} from '@alfalab/core-components-notification';

import styles from './index.module.css';

type NotificationProps = {
    element: CoreNotificationProps & { id: string };
    onRemoveNotification: (id: string) => void;
};

export const Notification: FC<NotificationProps> = ({ element, onRemoveNotification }) => {
    const { className: notificationClassName, onClose, onCloseTimeout } = element;

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }

        onRemoveNotification(element.id);
    }, [onClose, onRemoveNotification, element.id]);

    const handleCloseTimeout = useCallback(() => {
        if (onCloseTimeout) {
            onCloseTimeout();
        }

        onRemoveNotification(element.id);
    }, [element.id, onCloseTimeout, onRemoveNotification]);

    // const notificationProps = useMemo(
    //     () => ({
    //         ...element,
    //         visible: true,
    //         className: cn(notificationClassName, styles.notification),
    //         usePortal: false,
    //         offset: 0,
    //         onClose: handleClose,
    //         // onCloseTimeout: handleCloseTimeout,
    //     }),
    //     [element, handleClose, notificationClassName],
    // );

    // return cloneElement(element, notificationProps);
    return (
        <CoreNotification
            {...element}
            key={element.id}
            visible={true}
            className={cn(notificationClassName, styles.notification)}
            usePortal={false}
            offset={0}
            onClose={handleClose}
            onCloseTimeout={handleCloseTimeout}
        />
    );
};
