import React, { forwardRef, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { SwipeCallback, useSwipeable } from 'react-swipeable';

import { Stack, stackingOrder } from '@alfalab/core-components-stack';
import { Portal } from '@alfalab/core-components-portal';
import { Backdrop } from '@alfalab/core-components-backdrop';
import { Typography } from '@alfalab/core-components-typography';
import { handleContainer } from '@alfalab/core-components-base-modal';

import styles from './index.module.css';

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
     * Будет ли свайпаться на десктопе
     * @default false
     */
    desktopSwipeable?: boolean;

    /**
     * Обработчик закрытия
     */
    onClose: () => void;
};

const DEFAULT_TRANSITION: CSSTransitionProps<HTMLDivElement> = {
    timeout: 200,
};

const SWIPE_CLOSE_VELOCITY = 0.3;
const CLOSE_OFFSET = 0.33;
const MIN_BACKDROP_OPACITY = 0.2;

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
            desktopSwipeable: trackMouse = false,
            onClose,
        },
        ref,
    ) => {
        const [exited, setExited] = useState(!open);
        const [sheetOffset, setSheetOffset] = useState(0);
        const [backdropOpacity, setBackdropOpacity] = useState(1);
        const [scrollLocked, setScrollLocked] = useState(false);

        const sheetHeight = useRef(0);
        const scrollableContainer = useRef<HTMLDivElement | null>(null);
        const restoreContainerStylesFn = useRef<Function | null>(null);
        const scrollableContainerScrollValue = useRef(0);

        const getBackdropOpacity = (offset: number): number => {
            const opacity = 1 - (1 - MIN_BACKDROP_OPACITY) * (offset / sheetHeight.current);

            return Number(opacity.toFixed(2));
        };

        const getSheetOffset = (deltaY: number): number => {
            let offset = deltaY > 0 ? 0 : -deltaY;
            offset -= scrollableContainerScrollValue.current;

            return Math.floor(Math.max(0, offset));
        };

        /**
         * Если контент внутри шторки скроллится - то шторка не должна свайпаться
         */
        const shouldSkipSwiping = () => {
            if (!scrollableContainer.current) {
                return false;
            }

            if (!scrollableContainerScrollValue.current) {
                scrollableContainerScrollValue.current = Math.floor(
                    scrollableContainer.current.scrollTop,
                );
            }

            return scrollableContainer.current.scrollTop > 0;
        };

        const handleBackdropSwipedDown: SwipeCallback = ({ velocity }) => {
            if (velocity > swipeCloseVelocity) {
                onClose();
            }
        };

        const handleSheetSwipedDown: SwipeCallback = () => {
            if (shouldSkipSwiping()) {
                return;
            }

            if (sheetOffset > sheetHeight.current * closeOffset) {
                onClose();
            } else {
                setSheetOffset(0);
                setBackdropOpacity(1);
            }
        };

        const handleSheetSwiped: SwipeCallback = () => {
            setScrollLocked(false);
            scrollableContainerScrollValue.current = 0;
        };

        const handleSheetSwiping: SwipeCallback = ({ deltaY }) => {
            if (shouldSkipSwiping()) {
                return;
            }

            const offset = getSheetOffset(deltaY);
            const opacity = getBackdropOpacity(offset);

            setSheetOffset(offset);
            setBackdropOpacity(opacity);

            /**
             * Если шторка начинает свайпаться, то блокируем скролл внутри нее
             */
            if (offset > 0) {
                setScrollLocked(true);
            }
        };

        const backdropSwipeablehandlers = useSwipeable({
            onSwipedDown: handleBackdropSwipedDown,
            delta: 100,
            trackMouse,
        });

        const sheetSwipeablehandlers = useSwipeable({
            onSwiping: handleSheetSwiping,
            onSwipedDown: handleSheetSwipedDown,
            onSwiped: handleSheetSwiped,
            delta: 5,
            trackMouse,
        });

        const handleBackdropClick = useCallback(() => {
            onClose();
        }, [onClose]);

        const handleExited = useCallback(
            node => {
                setExited(true);
                setBackdropOpacity(1);

                if (transition.onExited) {
                    transition.onExited(node);
                }
            },
            [transition],
        );

        const handleEntered = useCallback(
            (node, isAppearing) => {
                if (!sheetHeight.current) {
                    sheetHeight.current = node.getBoundingClientRect().height;
                }

                setBackdropOpacity(1);

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
                setSheetOffset(0);
            }
        }, [open]);

        useEffect(() => {
            if (open) {
                restoreContainerStylesFn.current = handleContainer(document.body);
            }

            return () => {
                if (restoreContainerStylesFn.current) {
                    restoreContainerStylesFn.current();
                    restoreContainerStylesFn.current = null;
                }
            };
        }, [open]);

        return open || !exited ? (
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
                                        transform: sheetOffset
                                            ? `translateY(${sheetOffset}px)`
                                            : '',
                                        transition: sheetOffset
                                            ? 'none'
                                            : `transform ${transition.timeout}ms ease-in-out`,
                                    }}
                                    {...sheetSwipeablehandlers}
                                >
                                    <div className={styles.marker} />

                                    <div
                                        className={cn(styles.scrollableContainer, {
                                            [styles.scrollLocked]: scrollLocked,
                                        })}
                                        ref={scrollableContainer}
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

                                        <div className={cn(styles.content, contentClassName)}>
                                            {children}
                                        </div>

                                        {actionButton && (
                                            <div className={styles.actionButtonWrapper}>
                                                {actionButton}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                    </Portal>
                )}
            </Stack>
        ) : null;
    },
);

BottomSheet.defaultProps = {
    swipeCloseVelocity: SWIPE_CLOSE_VELOCITY,
    closeOffset: CLOSE_OFFSET,
    desktopSwipeable: false,
};
