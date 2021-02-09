import React, { forwardRef, useCallback, MouseEvent, useRef, useEffect, useState } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useSwipeable, LEFT, RIGHT, UP } from 'react-swipeable';
import { Portal } from '@alfalab/core-components-portal';
import { ToastPlate, ToastPlateProps } from '@alfalab/core-components-toast-plate';

import { useClickOutside } from './utils';

import styles from './index.module.css';

export type NotificationProps = ToastPlateProps & {
    /**
     * Управление видимостью компонента
     */
    visible?: boolean;

    /**
     * Отступ от верхнего края
     */
    offset?: number;

    /**
     * Время до закрытия компонента
     */
    autoCloseDelay?: number;

    /**
     * Обработчик события истечения времени до закрытия компонента
     */
    onCloseTimeout?: () => void;

    /**
     * Обработчик события наведения курсора на компонент
     */
    onMouseEnter?: (event?: MouseEvent<HTMLDivElement>) => void;

    /**
     * Обработчик события снятия курсора с компонента
     */
    onMouseLeave?: (event?: MouseEvent<HTMLDivElement>) => void;

    /**
     * Обработчик клика вне компонента
     */
    onClickOutside?: (event?: MouseEvent<any>) => void;
};

const notificationClassNameSelector = `.${styles.notificationComponent}`;

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(
    (
        {
            className,
            children,
            visible,
            offset = 108,
            hasCloser = true,
            autoCloseDelay = 5000,
            onClose,
            onCloseTimeout,
            onMouseEnter,
            onMouseLeave,
            onClickOutside,
            style,
            ...restProps
        },
        ref,
    ) => {
        const notificationRef = useRef<HTMLDivElement>(null);
        const autoCloseTimeoutRef = useRef(0);
        const closeTimeoutRef = useRef(0);

        const [isClosing, setIsClosing] = useState(false);

        const startAutoCloseTimer = useCallback(() => {
            autoCloseTimeoutRef.current = window.setTimeout(() => {
                if (onCloseTimeout) {
                    onCloseTimeout();
                }
            }, autoCloseDelay);
        }, [autoCloseDelay, onCloseTimeout]);

        const stopAutoCloseTimer = useCallback(() => {
            clearTimeout(autoCloseTimeoutRef.current);
        }, []);

        useEffect(
            () => () => {
                clearTimeout(closeTimeoutRef.current);
            },
            [],
        );

        useEffect(() => {
            if (visible) {
                startAutoCloseTimer();
            }

            return () => {
                stopAutoCloseTimer();
            };
        }, [startAutoCloseTimer, stopAutoCloseTimer, visible]);

        const handleMouseEnter = useCallback(
            event => {
                stopAutoCloseTimer();

                if (onMouseEnter) {
                    onMouseEnter(event);
                }
            },
            [onMouseEnter, stopAutoCloseTimer],
        );

        const handleMouseLeave = useCallback(
            event => {
                stopAutoCloseTimer();
                startAutoCloseTimer();

                if (onMouseLeave) {
                    onMouseLeave(event);
                }
            },
            [onMouseLeave, startAutoCloseTimer, stopAutoCloseTimer],
        );

        const handleOutsideClick = useCallback(
            event => {
                const isTargetNotification = !!event.target.closest(notificationClassNameSelector);

                /*
                 *  проверка isTargetNotification нужна для предотвращения срабатывания handleOutsideClick
                 *  при клике на другие нотификации, если их несколько на странице
                 */
                if (onClickOutside && visible && !isTargetNotification) {
                    onClickOutside(event);
                }
            },
            [onClickOutside, visible],
        );

        useClickOutside(notificationRef, handleOutsideClick);

        const swipeableHandlers = useSwipeable({
            onSwiped: ({ dir }) => {
                if (onClose && [LEFT, RIGHT, UP].includes(dir)) {
                    setIsClosing(true);

                    closeTimeoutRef.current = window.setTimeout(() => {
                        setIsClosing(false);
                        onClose();
                    }, 100);
                }
            },
            delta: 100,
            trackMouse: true,
        });

        return (
            <Portal>
                <div {...swipeableHandlers}>
                    <ToastPlate
                        className={cn(
                            styles.notificationComponent,
                            {
                                [styles.isVisible]: visible,
                                [styles.isClosing]: isClosing,
                            },
                            className,
                        )}
                        style={{
                            top: offset,
                            ...style,
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        ref={mergeRefs([ref, notificationRef])}
                        role={visible ? 'alert' : undefined}
                        hasCloser={hasCloser}
                        onClose={onClose}
                        {...restProps}
                    >
                        {children}
                    </ToastPlate>
                </div>
            </Portal>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Notification.defaultProps = {
    autoCloseDelay: 5000,
    offset: 108,
    hasCloser: true,
};
