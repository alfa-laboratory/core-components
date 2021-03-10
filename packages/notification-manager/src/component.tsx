import React, {
    forwardRef,
    ReactElement,
    isValidElement,
    HTMLAttributes,
    useEffect,
    useRef,
} from 'react';
import cn from 'classnames';

import { NotificationProps } from '@alfalab/core-components-notification';
import { Portal } from '@alfalab/core-components-portal';

import { Notification } from './components';

import styles from './index.module.css';

export type NotificationManagerProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Массив нотификаций (native prop)
     */
    notifications: Array<NotificationProps & { id: string }>;

    /**
     * Дополнительный класс (native prop)
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Удаление нотификации
     */
    onRemoveNotification: (id: string) => void;
};

export const NotificationManager = forwardRef<HTMLDivElement, NotificationManagerProps>(
    ({ children, className, notifications, onRemoveNotification, ...restProps }, ref) => {
        // useEffect(() => {
        //     notifications.forEach(notification => {
        //         window.setTimeout(() => {
        //             if (notifications.find(n => n.id === notification.id)) {
        //                 onRemoveNotification(notification.id);
        //             }
        //         }, notification.autoCloseDelay);
        //     });
        // }, [notifications, onRemoveNotification]);

        return (
            <Portal>
                <div className={cn(styles.component, className)} ref={ref} {...restProps}>
                    {notifications.map(element => {
                        // if (!isValidElement(element)) {
                        //     return null;
                        // }

                        return (
                            <Notification
                                key={element.id}
                                element={element}
                                onRemoveNotification={onRemoveNotification}
                            />
                        );
                    })}
                </div>
            </Portal>
        );
    },
);
