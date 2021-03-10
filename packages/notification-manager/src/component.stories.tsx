import React, { useCallback, useState } from 'react';
import { Button } from '@alfalab/core-components-button';

import { NotificationManager } from '.';

export const Story = () => {
    const [notifications, setNotifications] = useState([]);

    const [count, setCount] = useState(0);

    const addNotification = () => {
        setNotifications(
            [
                {
                    badge: 'positive',
                    title: `Нотификация ${notifications.length}`,
                    autoCloseDelay: 3000,
                    id: count.toString(),
                },
            ].concat(notifications),
        );
        setCount(val => val + 1);
    };

    const removeNotification = useCallback(
        id => {
            setNotifications(notifications.filter(notification => notification.id !== id));
        },
        [notifications],
    );

    return (
        <div>
            <Button onClick={addNotification}>Добавить нотификацию</Button>
            <NotificationManager
                onRemoveNotification={removeNotification}
                notifications={notifications}
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
