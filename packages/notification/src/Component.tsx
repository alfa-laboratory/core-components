import React, {
    forwardRef,
    useCallback,
    ReactNode,
    MouseEvent,
    useRef,
    HTMLAttributes,
    useEffect,
    useState,
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
    negative: <CrossMIcon className={cn(styles.iconSvg)} />,
    positive: <CheckmarkMIcon className={cn(styles.iconSvg)} />,
    warning: <ExclamationMIcon className={cn(styles.iconSvg)} />,
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
                if (onClickOutside && visible) {
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
            <div {...swipeableHandlers}>
                <div
                    className={cn(
                        styles.component,
                        {
                            [styles.isVisible]: visible,
                            [styles.hasCloser]: hasCloser,
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
                    {hasCloser && onClose && (
                        <Button
                            className={cn(styles.closer)}
                            view='ghost'
                            onClick={onClose}
                            aria-label='закрыть'
                        >
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
