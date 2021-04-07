import React, {
    useCallback,
    useRef,
    useState,
    forwardRef,
    MouseEvent,
    KeyboardEvent,
    ReactNode,
    useEffect,
    useMemo,
    Ref,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { ResizeObserver } from 'resize-observer';
import { CSSTransition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import FocusLock from 'react-focus-lock';

import { Portal, PortalProps } from '@alfalab/core-components-portal';
import { Stack, stackingOrder } from '@alfalab/core-components-stack';

import { handleContainer, hasScrollbar, isScrolledToBottom, isScrolledToTop } from './utils';

import styles from './index.module.css';
import backdropTransitions from './transitions/backdrop.module.css';

export type ModalProps = {
    /**
     * Контент
     */
    children?: ReactNode;

    /**
     * Скрыть бэкдроп
     * @default false
     */
    hideBackdrop?: boolean;

    /**
     * Свойства для Бэкдропа
     * @default timeout: 200, appear: true
     */
    backdropProps?: Partial<TransitionProps>;

    /**
     * Нода, компонент или функция возвращающая их
     *
     * Контейнер к которому будут добавляться порталы
     */
    container?: PortalProps['getPortalContainer'];

    /**
     * Отключает автоматический перевод фокуса на модалку при открытии
     * @default false
     */
    disableAutoFocus?: boolean;

    /**
     * Отключает ловушку фокуса
     * @default false
     */
    disableFocusLock?: boolean;

    /**
     * Отключает восстановление фокуса на предыдущем элементе после закрытия модалки
     * @default false
     */
    disableRestoreFocus?: boolean;

    /**
     * Отключает вызов `callback` при нажатии Escape
     * @default false
     */
    disableEscapeKeyDown?: boolean;

    /**
     * Отключает вызов `callback` при клике на бэкдроп
     * @default false
     */
    disableBackdropClick?: boolean;

    /**
     * Содержимое модалки всегда в DOM
     * @default false
     */
    keepMounted?: boolean;

    /**
     * Управление видимостью модалки
     */
    open: boolean;

    /**
     * Указывает, когда вызывать коллбэк закрытия — при закрытии бэкдропа или самого контента
     */
    targetHandleExited?: 'children' | 'backdrop';

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для обертки (Modal)
     */
    wrapperClassName?: string;

    /**
     * Управление возможностью сделать модальное окно на весь экран
     * @default false
     */
    fullscreen?: boolean;

    /**
     * Пропсы для анимации (CSSTransition)
     */
    transitionProps?: Partial<TransitionProps>;

    /**
     * z-index компонента
     */
    zIndex?: number;

    /**
     * Обработчик события нажатия на бэкдроп
     */
    onBackdropClick?: (event: MouseEvent) => void;

    /**
     * Обработчик события нажатия на Escape
     *
     * Если `disableEscapeKeyDown` - false и модальное окно в фокусе
     */
    onEscapeKeyDown?: (event: KeyboardEvent) => void;

    /**
     * Обработчик закрытия
     */
    onClose?: (
        event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
        reason?: 'backdropClick' | 'escapeKeyDown' | 'closerClick',
    ) => void;

    /**
     * Обработчик события onEntered компонента Transition
     */
    onMount?: () => void;

    /**
     * Обработчик события onExited компонента Transition
     */
    onUnmount?: () => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export type ModalContext = {
    hasFooter?: boolean;
    hasHeader?: boolean;
    hasScroll?: boolean;
    fullscreen?: boolean;
    headerHighlighted?: boolean;
    footerHighlighted?: boolean;
    contentRef: Ref<HTMLElement>;
    setHasHeader: (exists: boolean) => void;
    setHasFooter: (exists: boolean) => void;
    onClose: Required<ModalProps>['onClose'];
};

export const ModalContext = React.createContext<ModalContext>({
    hasFooter: false,
    hasHeader: false,
    hasScroll: false,
    fullscreen: false,
    headerHighlighted: false,
    footerHighlighted: false,
    contentRef: () => null,
    setHasHeader: () => null,
    setHasFooter: () => null,
    onClose: () => null,
});

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            open,
            container,
            children,
            fullscreen,
            hideBackdrop = false,
            backdropProps = {},
            transitionProps = {},
            disableAutoFocus = false,
            disableBackdropClick = false,
            disableFocusLock = false,
            disableEscapeKeyDown = false,
            disableRestoreFocus = false,
            keepMounted = false,
            targetHandleExited = hideBackdrop ? 'children' : 'backdrop',
            className,
            wrapperClassName,
            zIndex = stackingOrder.MODAL,
            onBackdropClick,
            onClose,
            onEscapeKeyDown,
            onMount,
            onUnmount,
            dataTestId,
        },
        ref,
    ) => {
        const [exited, setExited] = useState(!open);
        const [hasScroll, setHasScroll] = useState(false);
        const [hasHeader, setHasHeader] = useState(false);
        const [hasFooter, setHasFooter] = useState(false);
        const [headerHighlighted, setHeaderHighlighted] = useState(false);
        const [footerHighlighted, setFooterHighlighted] = useState(false);

        const wrapperRef = useRef<HTMLDivElement>(null);
        const componentRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const scrollableNodeRef = useRef<HTMLDivElement | null>(null);
        const restoreContainerStyles = useRef<null | Function>(null);

        const shouldHighlightHeader = hasHeader;
        const shouldHighlightFooter = hasFooter;
        const shouldRender = keepMounted || open || !exited;

        const resizeObserver = useMemo(() => {
            return new ResizeObserver(() => {
                if (scrollableNodeRef.current) {
                    const scrollExists = hasScrollbar(scrollableNodeRef.current);
                    setFooterHighlighted(scrollExists);
                    setHasScroll(scrollExists);
                }
            });
        }, []);

        const addResizeHandle = useCallback(() => {
            if (scrollableNodeRef.current && contentRef.current) {
                resizeObserver.observe(scrollableNodeRef.current);
                resizeObserver.observe(contentRef.current);
            }
        }, [resizeObserver]);

        const removeResizeHandle = useCallback(() => {
            resizeObserver.disconnect();
        }, [resizeObserver]);

        const handleScroll = useCallback(() => {
            if (!scrollableNodeRef.current) return;

            if (shouldHighlightHeader) {
                setHeaderHighlighted(isScrolledToTop(scrollableNodeRef.current) === false);
            }

            if (shouldHighlightFooter) {
                setFooterHighlighted(isScrolledToBottom(scrollableNodeRef.current) === false);
            }
        }, [shouldHighlightFooter, shouldHighlightHeader]);

        const handleClose = useCallback<Required<ModalProps>['onClose']>(
            (event, reason) => {
                if (onClose) {
                    onClose(event, reason);
                }

                if (reason === 'backdropClick' && onBackdropClick) {
                    onBackdropClick(event as MouseEvent);
                }

                if (reason === 'escapeKeyDown' && onEscapeKeyDown) {
                    onEscapeKeyDown(event as KeyboardEvent);
                }

                return null;
            },
            [onBackdropClick, onClose, onEscapeKeyDown],
        );

        const handleBackdropClick = useCallback(
            (event: MouseEvent<HTMLDivElement>) => {
                if (event.target !== event.currentTarget) {
                    return;
                }

                if (!disableBackdropClick && handleClose) {
                    handleClose(event, 'backdropClick');
                }
            },
            [disableBackdropClick, handleClose],
        );

        const handleKeyDown = useCallback(
            (event: KeyboardEvent<HTMLDivElement>) => {
                /*
                 * Чтобы сохранить дефолтное поведение элементов и событий форм,
                 * обработчик не устанавливает event.preventDefault()
                 */
                if (event.key !== 'Escape') {
                    return;
                }

                // Если есть обработчик escape на body
                event.stopPropagation();

                if (!disableEscapeKeyDown && handleClose) {
                    handleClose(event, 'escapeKeyDown');
                }
            },
            [disableEscapeKeyDown, handleClose],
        );

        const handleBackdropExited = useCallback(
            (node: HTMLElement) => {
                if (targetHandleExited === 'backdrop') {
                    setExited(true);
                }

                if (backdropProps.onExited) {
                    backdropProps.onExited(node);
                }
            },
            [backdropProps, targetHandleExited],
        );

        const handleEntered: Required<TransitionProps>['onEntered'] = useCallback(
            (node, isAppearing) => {
                scrollableNodeRef.current = fullscreen ? componentRef.current : wrapperRef.current;

                addResizeHandle();

                if (scrollableNodeRef.current) {
                    scrollableNodeRef.current.addEventListener('scroll', handleScroll);
                    handleScroll();
                }

                if (transitionProps.onEnter) {
                    transitionProps.onEnter(node, isAppearing);
                }

                if (onMount) onMount();
            },
            [addResizeHandle, fullscreen, handleScroll, onMount, transitionProps],
        );

        const handleExited: Required<TransitionProps>['onExited'] = useCallback(
            node => {
                removeResizeHandle();

                if (scrollableNodeRef.current) {
                    scrollableNodeRef.current.removeEventListener('scroll', handleScroll);
                }

                if (targetHandleExited === 'children') {
                    setExited(true);
                }

                if (transitionProps.onExited) {
                    transitionProps.onExited(node);
                }

                if (onUnmount) onUnmount();
            },
            [handleScroll, onUnmount, removeResizeHandle, targetHandleExited, transitionProps],
        );

        useEffect(() => {
            if (open) {
                restoreContainerStyles.current = handleContainer(
                    (container ? container() : document.body) as HTMLElement,
                );
            }

            return () => {
                if (restoreContainerStyles.current) {
                    restoreContainerStyles.current();
                    restoreContainerStyles.current = null;
                }
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [open]);

        useEffect(() => {
            if (open) setExited(false);
        }, [open]);

        useEffect(() => {
            return () => {
                resizeObserver.disconnect();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const contextValue = useMemo<ModalContext>(
            () => ({
                hasHeader,
                hasFooter,
                hasScroll,
                fullscreen,
                headerHighlighted,
                footerHighlighted,
                contentRef,
                setHasHeader,
                setHasFooter,
                onClose: handleClose,
            }),
            [
                hasHeader,
                hasFooter,
                hasScroll,
                fullscreen,
                headerHighlighted,
                footerHighlighted,
                handleClose,
            ],
        );

        if (!shouldRender) return null;

        return (
            <Stack value={zIndex}>
                {computedZIndex => (
                    <Portal getPortalContainer={container}>
                        <ModalContext.Provider value={contextValue}>
                            <FocusLock
                                autoFocus={!disableAutoFocus}
                                disabled={disableFocusLock || !open}
                                returnFocus={!disableRestoreFocus}
                            >
                                <CSSTransition
                                    classNames={backdropTransitions}
                                    appear={true}
                                    timeout={200}
                                    {...backdropProps}
                                    in={open}
                                    onExited={handleBackdropExited}
                                >
                                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                                    <div
                                        role='dialog'
                                        className={cn(styles.wrapper, wrapperClassName, {
                                            [styles.hidden]: !open && exited,
                                            [styles.wrapperFullscreen]: fullscreen,
                                            [styles.hideBackdrop]: hideBackdrop,
                                        })}
                                        ref={mergeRefs([wrapperRef, ref])}
                                        onKeyDown={handleKeyDown}
                                        tabIndex={-1}
                                        data-test-id={dataTestId}
                                        onClick={handleBackdropClick}
                                        style={{ zIndex: computedZIndex }}
                                    >
                                        <CSSTransition
                                            appear={true}
                                            timeout={200}
                                            {...transitionProps}
                                            in={open}
                                            onEntered={handleEntered}
                                            onExited={handleExited}
                                        >
                                            <div
                                                className={cn(styles.component, className, {
                                                    [styles.fullscreen]: fullscreen,
                                                })}
                                                ref={componentRef}
                                            >
                                                {children}
                                            </div>
                                        </CSSTransition>
                                    </div>
                                </CSSTransition>
                            </FocusLock>
                        </ModalContext.Provider>
                    </Portal>
                )}
            </Stack>
        );
    },
);
