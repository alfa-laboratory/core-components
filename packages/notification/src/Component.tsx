import React, {
    forwardRef,
    useCallback,
    ReactNode,
    MouseEvent,
    useRef,
    HTMLAttributes,
    useEffect,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { useSwipeable, LEFT, RIGHT, UP } from 'react-swipeable';
import { CloseSWhiteIcon } from '@alfalab/icons-classic';
import { CheckmarkMIcon, CrossMIcon, ExclamationMIcon } from '@alfalab/icons-glyph';
import { Button } from '@alfalab/core-components-button';
import { useClickOutside } from './utils';

import styles from './index.module.css';

export type NotificationProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дочерние элементы
     */
    children?: ReactNode;

    /**
     * Управление видимостью компонента
     */
    visible?: boolean;

    /**
     * Отступ от верхнего края
     */
    offset?: number;

    /**
     * Управляет отображением кнопки закрытия уведомления
     */
    hasCloser?: boolean;

    /**
     * Заголовок компонента
     */
    title?: ReactNode;

    /**
     * Вид иконки
     */
    icon?: 'negative' | 'positive' | 'warning';

    /**
     * Слот слева, заменяет стандартную иконку
     */
    leftAddons?: ReactNode;

    /**
     * Время до закрытия компонента
     */
    autoCloseDelay?: number;

    /**
     * Обработчик клика по крестику
     */
    onClose?: (event?: MouseEvent<HTMLButtonElement>) => void;

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

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

const iconComponent = {
    negative: <CrossMIcon />,
    positive: <CheckmarkMIcon />,
    warning: <ExclamationMIcon />,
};

export const Notification = forwardRef<HTMLDivElement, NotificationProps>(
    (
        {
            className,
            children,
            visible,
            offset = 108,
            hasCloser = true,
            title,
            icon,
            leftAddons,
            autoCloseDelay = 5000,
            onClose,
            onCloseTimeout,
            onMouseEnter,
            onMouseLeave,
            onClickOutside,
            dataTestId,
            style,
            ...restProps
        },
        ref,
    ) => {
        const notificationRef = useRef<HTMLDivElement>(null);
        const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

        const startCloseTimer = useCallback(() => {
            closeTimeoutRef.current = setTimeout(() => {
                if (onCloseTimeout) {
                    onCloseTimeout();
                }
            }, autoCloseDelay);
        }, [autoCloseDelay, onCloseTimeout]);

        const stopCloseTimer = useCallback(() => {
            clearTimeout(closeTimeoutRef.current as NodeJS.Timeout);
            closeTimeoutRef.current = null;
        }, []);

        useEffect(() => {
            if (visible) {
                startCloseTimer();
            }

            return () => {
                stopCloseTimer();
            };
        }, [startCloseTimer, stopCloseTimer, visible]);

        const handleMouseEnter = useCallback(
            event => {
                stopCloseTimer();

                if (onMouseEnter) {
                    onMouseEnter(event);
                }
            },
            [onMouseEnter, stopCloseTimer],
        );

        const handleMouseLeave = useCallback(
            event => {
                stopCloseTimer();
                startCloseTimer();

                if (onMouseLeave) {
                    onMouseLeave(event);
                }
            },
            [onMouseLeave, startCloseTimer, stopCloseTimer],
        );

        const handleOutsideClick = useCallback(
            event => {
                if (onClickOutside && visible) {
                    onClickOutside(event);
                }
            },
            [onClickOutside, visible],
        );

        useClickOutside(notificationRef, handleOutsideClick);

        const swipableHandlers = useSwipeable({
            onSwiped: ({ dir }) => {
                if (onClose && (dir === LEFT || dir === RIGHT || dir === UP)) {
                    onClose();
                }
            },
            delta: 100,
            trackMouse: true,
        });

        return (
            <div {...swipableHandlers}>
                <div
                    className={cn(
                        styles.component,
                        {
                            [styles.isVisible]: visible,
                            [styles.hasCloser]: hasCloser,
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
                    data-test-id={dataTestId}
                    {...restProps}
                >
                    {(leftAddons || icon) && (
                        <div className={cn(styles.leftAddons)}>
                            {leftAddons ||
                                (icon && (
                                    <div className={cn(styles.icon, styles[icon])}>
                                        {iconComponent[icon]}
                                    </div>
                                ))}
                        </div>
                    )}
                    <div className={cn(styles.contentContainer)}>
                        {title && <div className={cn(styles.title)}>{title}</div>}
                        {children && <div className={cn(styles.content)}>{children}</div>}
                    </div>
                    {hasCloser && (
                        <Button className={cn(styles.closer)} view='ghost' onClick={onClose}>
                            <CloseSWhiteIcon />
                        </Button>
                    )}
                </div>
            </div>
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
