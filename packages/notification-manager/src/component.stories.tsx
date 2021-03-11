import React, { useCallback, useState } from 'react';
import { Button } from '@alfalab/core-components-button';
import { Notification } from '@alfalab/core-components-notification';

import { NotificationManager, NotificationManagerProps } from '.';

export const Story = () => {
    const [notifications, setNotifications] = useState<NotificationManagerProps['notifications']>(
        [],
    );

    const [count, setCount] = useState(0);

    const addNotification = () => {
        const newNotification = (
            <Notification
                badge='positive'
                title={`Нотификация #${count}`}
                autoCloseDelay={3000}
                id={count.toString()}
                key={count.toString()}
            />
        );

        notifications.unshift(newNotification);

        setNotifications([...notifications]);

        setCount(val => val + 1);
    };

    const removeNotification = useCallback(id => {
        /**
         * Обратите внимание, что актуальный массив нотификаций
         * нужно брать из аргументов функции обновления состояния.
         */
        setNotifications(actualNotifications =>
            actualNotifications.filter(notification => notification.props.id !== id),
        );
    }, []);

    return (
        <div>
            <Button onClick={addNotification}>Добавить нотификацию</Button>
            <NotificationManager
                notifications={notifications}
                onRemoveNotification={removeNotification}
            />
        </div>
    );
};

export default {
    title: 'NotificationManager',
    component: NotificationManager,
};

Story.story = {
    name: 'NotificationManager',
};
