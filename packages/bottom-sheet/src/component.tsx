import React, { forwardRef, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { useSwipeable } from 'react-swipeable';

import { Stack, stackingOrder } from '@alfalab/core-components-stack';
import { Portal } from '@alfalab/core-components-portal';
import { Backdrop } from '@alfalab/core-components-backdrop';
import { Typography } from '@alfalab/core-components-typography';

import styles from './index.module.css';

const DEFAULT_TRANSITION: CSSTransitionProps<HTMLDivElement> = {
    timeout: 200,
};

export type BottomSheetProps = {
    /**
     * Управление видимостью
     */
    open: boolean;

    /**
     * Заголовок
     */
    title?: ReactNode;

    /**
     * Кнопка действия (обычно, это кнопка закрытия)
     */
    actionButton?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс
     */
    contentClassName?: string;

    /**
     * CSSTransitionProps, прокидываются в компонент CSSTransitionProps.
     */
    transition?: CSSTransitionProps;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * z-index компонента
     */
    zIndex?: number;

    /**
     * Минимальная скорость смахивания, при которой шторка закроется
     * https://github.com/FormidableLabs/react-swipeable#swipe-event-data
     * @default 0.3
     */
    swipeCloseVelocity?: number;

    /**
     * Минимальное смещение шторки, при котором она закроется (от нуля до единицы)
     * @default 0.33
     */
    closeOffset?: number;

    /**
     * Обработчик закрытия
     */
    onClose: () => void;
};

export const SWIPE_CLOSE_VELOCITY = 0.3;
export const CLOSE_OFFSET = 0.33;

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
    (
        {
            open,
            title,
            actionButton,
            contentClassName,
            className,
            children,
            zIndex = stackingOrder.MODAL,
            transition = DEFAULT_TRANSITION,
            dataTestId,
            swipeCloseVelocity = SWIPE_CLOSE_VELOCITY,
            closeOffset = CLOSE_OFFSET,
            onClose,
        },
        ref,
    ) => {
        const [exited, setExited] = useState(!open);
        const [offset, setOffset] = useState(0);
        const height = useRef(0);

        const backdropSwipeablehandlers = useSwipeable({
            onSwipedDown: ({ velocity }) => {
                if (velocity > swipeCloseVelocity) {
                    onClose();
                }
            },
            delta: 100,
        });

        const sheetSwipeablehandlers = useSwipeable({
            onSwiping: ({ deltaY }) => {
                setOffset(deltaY > 0 ? 0 : -deltaY);
            },
            onSwipedDown: ({ velocity }) => {
                const shouldClose =
                    offset > height.current * closeOffset || velocity > swipeCloseVelocity;

                if (shouldClose) {
                    onClose();
                } else {
                    setOffset(0);
                }
            },
            delta: 5,
        });
        const handleBackdropClick = useCallback(() => {
            onClose();
        }, [onClose]);

        const handleExited = useCallback(
            node => {
                setExited(true);

                if (transition.onExited) {
                    transition.onExited(node);
                }
            },
            [transition],
        );

        const handleEntered = useCallback(
            (node, isAppearing) => {
                if (!height.current) {
                    height.current = node.getBoundingClientRect().height;
                }

                if (transition.onEntered) {
                    transition.onEntered(node, isAppearing);
                }
            },
            [transition],
        );

        useEffect(() => {
            if (open) {
                setExited(false);
            } else {
                setOffset(0);
            }
        }, [open]);

        const shouldRender = open || !exited;
        const backdropOpacity = height.current === 0 ? 1 : 1 - offset / height.current;

        if (!shouldRender) return null;

        return (
            <Stack value={zIndex}>
                {computedZIndex => (
                    <Portal>
                        <div
                            role='dialog'
                            ref={ref}
                            style={{ zIndex: computedZIndex }}
                            className={styles.wrapper}
                            tabIndex={-1}
                            data-test-id={dataTestId}
                        >
                            <div {...backdropSwipeablehandlers}>
                                <Backdrop
                                    open={open}
                                    onClick={handleBackdropClick}
                                    opacity={backdropOpacity}
                                />
                            </div>

                            <CSSTransition
                                appear={true}
                                classNames={styles}
                                {...transition}
                                in={open}
                                onExited={handleExited}
                                onEntered={handleEntered}
                            >
                                <div
                                    className={cn(styles.component, className)}
                                    style={{
                                        transform: offset ? `translateY(${offset}px)` : '',
                                        transition: offset
                                            ? 'none'
                                            : `transform ${transition.timeout}ms ease-in-out`,
                                    }}
                                    {...sheetSwipeablehandlers}
                                >
                                    {title && (
                                        <Typography.Title
                                            view='small'
                                            font='system'
                                            tag='h2'
                                            className={styles.title}
                                        >
                                            {title}
                                        </Typography.Title>
                                    )}

                                    <div className={styles.marker} />

                                    <div className={cn(styles.content, contentClassName)}>
                                        {children}
                                    </div>

                                    {actionButton && (
                                        <div className={styles.actionButtonWrapper}>
                                            {actionButton}
                                        </div>
                                    )}
                                </div>
                            </CSSTransition>
                        </div>
                    </Portal>
                )}
            </Stack>
        );
    },
);

BottomSheet.defaultProps = {
    swipeCloseVelocity: SWIPE_CLOSE_VELOCITY,
    closeOffset: CLOSE_OFFSET,
};
