import React, {
    CSSProperties,
    forwardRef,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import cn from 'classnames';
import { TransitionProps } from 'react-transition-group/Transition';
import { SwipeCallback, useSwipeable } from 'react-swipeable';
import { BaseModal } from '@alfalab/core-components-base-modal';
import { Typography } from '@alfalab/core-components-typography';

import { Footer } from './components/footer/Component';
import { SwipeableBackdrop } from './components/swipeable-backdrop/Component';

import styles from './index.module.css';

export type BottomSheetProps = {
    /**
     * Контент
     */
    children?: ReactNode;

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
     * TransitionProps, прокидываются в компонент CSSTransitionProps.
     */
    transitionProps?: Partial<TransitionProps>;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * z-index компонента
     */
    zIndex?: number;

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

const TIMEOUT = 300;
const SWIPE_CLOSE_VELOCITY = 0.4;
const MIN_BACKDROP_OPACITY = 0.2;

export const CLOSE_OFFSET = 0.2;

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
    (
        {
            open,
            title,
            actionButton,
            contentClassName,
            className,
            children,
            zIndex,
            transitionProps = {},
            dataTestId,
            desktopSwipeable: trackMouse = false,
            onClose,
        },
        ref,
    ) => {
        const [sheetOffset, setSheetOffset] = useState(0);
        const [backdropOpacity, setBackdropOpacity] = useState(1);
        const [scrollLocked, setScrollLocked] = useState(false);

        const sheetHeight = useRef(0);
        const scrollableContainer = useRef<HTMLDivElement | null>(null);
        const scrollableContainerScrollValue = useRef(0);

        const getBackdropOpacity = (offset: number): number => {
            if (sheetHeight.current === 0) return MIN_BACKDROP_OPACITY;

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
            if (velocity > SWIPE_CLOSE_VELOCITY) {
                onClose();
            }
        };

        const handleSheetSwipedDown: SwipeCallback = ({ velocity }) => {
            if (shouldSkipSwiping()) {
                return;
            }

            const shouldClose =
                sheetOffset > sheetHeight.current * CLOSE_OFFSET || velocity > SWIPE_CLOSE_VELOCITY;

            if (shouldClose) {
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

        const handleExited = useCallback(
            node => {
                setBackdropOpacity(1);

                if (transitionProps.onExited) {
                    transitionProps.onExited(node);
                }
            },
            [transitionProps],
        );

        const handleEntered = useCallback(
            (node, isAppearing) => {
                if (!sheetHeight.current) {
                    sheetHeight.current = node.getBoundingClientRect().height;
                }

                setBackdropOpacity(1);

                if (transitionProps.onEntered) {
                    transitionProps.onEntered(node, isAppearing);
                }
            },
            [transitionProps],
        );

        useEffect(() => {
            if (!open) {
                setSheetOffset(0);
            }
        }, [open]);

        const getSwipeStyles = (): CSSProperties => ({
            transform: sheetOffset ? `translateY(${sheetOffset}px)` : '',
        });

        return (
            <BaseModal
                open={open}
                ref={ref}
                dataTestId={dataTestId}
                zIndex={zIndex}
                onClose={onClose}
                onBackdropClick={onClose}
                scrollHandler={scrollableContainer}
                Backdrop={SwipeableBackdrop}
                backdropProps={{
                    opacity: backdropOpacity,
                    handlers: backdropSwipeablehandlers,
                    opacityTimeout: TIMEOUT,
                }}
                className={styles.modal}
                transitionProps={{
                    appear: true,
                    timeout: TIMEOUT,
                    classNames: styles,
                    ...transitionProps,
                    onExited: handleExited,
                    onEntered: handleEntered,
                }}
            >
                <div
                    className={cn(styles.component, className, {
                        [styles.withTransition]: !sheetOffset,
                    })}
                    style={getSwipeStyles()}
                    {...sheetSwipeablehandlers}
                >
                    <div className={styles.marker} />

                    <div
                        className={cn(styles.scrollableContainer, {
                            [styles.scrollLocked]: scrollLocked,
                            [styles.withPadding]: !actionButton,
                        })}
                        ref={scrollableContainer}
                    >
                        {title && (
                            <Typography.Title
                                view='small'
                                font='system'
                                tag='h2'
                                className={styles.title}
                                color='primary'
                            >
                                {title}
                            </Typography.Title>
                        )}

                        <div className={cn(styles.content, contentClassName)}>{children}</div>

                        {actionButton && <Footer>{actionButton}</Footer>}
                    </div>
                </div>
            </BaseModal>
        );
    },
);
