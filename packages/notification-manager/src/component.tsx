import React, { forwardRef, HTMLAttributes } from 'react';
import cn from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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

const CSS_TRANSITION_CLASS_NAMES = {
    enter: styles.enter,
    enterActive: styles.enterActive,
    exit: styles.exit,
    exitActive: styles.exitActive,
};

export const NotificationManager = forwardRef<HTMLDivElement, NotificationManagerProps>(
    ({ notifications, className, dataTestId, onRemoveNotification, ...restProps }, ref) => {
        return (
            <Portal>
                <div
                    className={cn(styles.component, className)}
                    ref={ref}
                    data-test-id={dataTestId}
                    {...restProps}
                >
                    <TransitionGroup>
                        {notifications.map(element => (
                            <CSSTransition
                                key={element.props.id}
                                timeout={200}
                                classNames={CSS_TRANSITION_CLASS_NAMES}
                                unmountOnExit={true}
                            >
                                <Notification
                                    element={element}
                                    className={styles.notification}
                                    onRemoveNotification={onRemoveNotification}
                                />
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </div>
            </Portal>
        );
    },
);
