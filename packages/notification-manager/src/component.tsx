import React, { forwardRef, HTMLAttributes } from 'react';
import cn from 'classnames';

import { Portal } from '@alfalab/core-components-portal';

import { Notification, NotificationElement } from './components';

import styles from './index.module.css';

export type NotificationManagerProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Массив нотификаций.
     * В нотификации обязательно передавайте id.
     */
    notifications: NotificationElement[];

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
    ({ notifications, className, onRemoveNotification, ...restProps }, ref) => {
        return (
            <Portal>
                <div className={cn(styles.component, className)} ref={ref} {...restProps}>
                    {notifications.map(element => {
                        return (
                            <Notification
                                key={element.props.id}
                                element={element}
                                className={styles.notification}
                                onRemoveNotification={onRemoveNotification}
                            />
                        );
                    })}
                </div>
            </Portal>
        );
    },
);
