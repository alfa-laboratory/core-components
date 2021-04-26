import React, {
    forwardRef,
    useCallback,
    MouseEvent,
    useRef,
    useEffect,
    useState,
    Fragment,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useSwipeable } from 'react-swipeable';
import { Portal } from '@alfalab/core-components-portal';
import { ToastPlate, ToastPlateProps } from '@alfalab/core-components-toast-plate';
import elementClosest from 'element-closest';

import { useClickOutside } from './utils';

import styles from './index.module.css';

elementClosest(window);

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
     * Использовать портал
     */
    usePortal?: boolean;

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            usePortal = true,
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
                if (onClose && ['Left', 'Right', 'Up'].includes(dir)) {
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

        const Wrapper = usePortal ? Portal : Fragment;

        return (
            <Wrapper>
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
                        contentClassName={styles.toastContent}
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
            </Wrapper>
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
    usePortal: true,
};
