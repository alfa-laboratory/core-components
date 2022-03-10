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

import { Footer } from './components/footer/Component';
import { SwipeableBackdrop } from './components/swipeable-backdrop/Component';

import styles from './index.module.css';
import { Header } from './components/header/Component';

export type BottomSheetTitleAlign = 'center' | 'left' | 'right';

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
     * Дополнительный класс
     */
    headerClassName?: string;

    /**
     * Дополнительный класс
     */
    addonClassName?: string;

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
     * Будет ли свайпаться шторка
     * @default true
     */
    swipeable?: boolean;

    /**
     * Слот слева
     */
    leftAddons?: ReactNode;

    /**
     * Слот справа
     */
    rightAddons?: ReactNode;

    /**
     * Выравнивание заголовка
     */
    titleAlign?: BottomSheetTitleAlign;

    /**
     * Фиксирует шапку
     */
    headerSticky?: boolean;

    /**
     * Фиксирует футер
     */
    footerSticky?: boolean;

    /**
     * Высота шторки
     */
    initialHeight?: 'default' | 'full';

    /**
     * Будет ли виден оверлэй
     */
    overlayHidden?: boolean;

    /**
     * Будет ли видна шапка
     */
    headerHidden?: boolean;

    /**
     * Запретить закрытие шторки кликом на оверлэй
     */
    disableOverlayClick?: boolean;

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
            headerClassName,
            addonClassName,
            className,
            leftAddons,
            rightAddons,
            titleAlign = 'center',
            headerSticky,
            footerSticky,
            initialHeight = 'default',
            overlayHidden,
            headerHidden,
            disableOverlayClick,
            children,
            zIndex,
            transitionProps = {},
            dataTestId,
            swipeable: trackMouse = true,
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

        const headerProps = {
            title,
            headerClassName,
            addonClassName,
            leftAddons,
            rightAddons,
            titleAlign,
            sticky: headerSticky,
            onClose
        };

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
                scrollHandler={scrollableContainer}
                Backdrop={SwipeableBackdrop}
                backdropProps={{
                    opacity: backdropOpacity,
                    handlers: trackMouse ? backdropSwipeablehandlers : false,
                    opacityTimeout: TIMEOUT,
                    invisible: initialHeight === 'full' ? false : overlayHidden
                }}
                disableBackdropClick={overlayHidden ? true : disableOverlayClick}
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
                    {trackMouse && <div className={cn(styles.marker)} />}

                    <div
                        className={cn(styles.scrollableContainer, {
                            [styles.fullHeight]: initialHeight === 'full',
                            [styles.scrollLocked]: scrollLocked
                        })}
                        ref={scrollableContainer}
                    >
                        {!headerHidden && <Header {...headerProps} />}

                        <div 
                            className={cn(styles.content, contentClassName, {
                                [styles.paddingTop]: headerHidden,
                                [styles.paddingBottom]: !actionButton
                            })}
                        >
                            {children}
                        </div>

                        {actionButton && <Footer sticky={footerSticky}>{actionButton}</Footer>}
                    </div>
                </div>
            </BaseModal>
        );
    },
);
