/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
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
import { Backdrop, BackdropProps } from '@alfalab/core-components-backdrop';

import { handleContainer, hasScrollbar, isScrolledToBottom, isScrolledToTop } from './utils';

import styles from './index.module.css';

export type BaseModalProps = {
    /**
     * Контент
     */
    children?: ReactNode;

    /**
     * Свойства для Бэкдропа
     */
    backdropProps?: Partial<BackdropProps> & Record<string, unknown>;

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
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс
     */
    contentClassName?: string;

    /**
     * Дополнительный класс для обертки (Modal)
     */
    wrapperClassName?: string;

    scrollHandler?: 'wrapper' | 'content';

    /**
     * Пропсы для анимации (CSSTransition)
     */
    transitionProps?: Partial<TransitionProps>;

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

export type BaseModalContext = {
    hasFooter?: boolean;
    hasHeader?: boolean;
    hasScroll?: boolean;
    headerHighlighted?: boolean;
    footerHighlighted?: boolean;
    contentRef: Ref<HTMLElement>;
    setHasHeader: (exists: boolean) => void;
    setHasFooter: (exists: boolean) => void;
    onClose: Required<BaseModalProps>['onClose'];
};

export const BaseModalContext = React.createContext<BaseModalContext>({
    hasFooter: false,
    hasHeader: false,
    hasScroll: false,
    headerHighlighted: false,
    footerHighlighted: false,
    contentRef: () => null,
    setHasHeader: () => null,
    setHasFooter: () => null,
    onClose: () => null,
});

export const BaseModal = forwardRef<HTMLDivElement, BaseModalProps>(
    (
        {
            open,
            container,
            children,
            scrollHandler = 'wrapper',
            backdropProps = {},
            transitionProps = {},
            disableBackdropClick,
            disableAutoFocus = false,
            disableFocusLock = false,
            disableEscapeKeyDown = false,
            disableRestoreFocus = false,
            keepMounted = false,
            className,
            contentClassName,
            wrapperClassName,
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

        const componentRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);
        const wrapperRef = useRef<HTMLDivElement>(null);
        const scrollableNodeRef = useRef<HTMLDivElement | null>(null);
        const restoreContainerStyles = useRef<null | Function>(null);

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

            if (componentRef.current) {
                if (hasHeader) {
                    setHeaderHighlighted(
                        isScrolledToTop(scrollableNodeRef.current) === false &&
                            componentRef.current.getBoundingClientRect().top <= 0,
                    );
                }

                if (hasFooter) {
                    setFooterHighlighted(
                        isScrolledToBottom(scrollableNodeRef.current) === false &&
                            componentRef.current.getBoundingClientRect().bottom >=
                                window.innerHeight,
                    );
                }
            }
        }, [hasFooter, hasHeader]);

        const handleClose = useCallback<Required<BaseModalProps>['onClose']>(
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

        const handleBackdropClick = (event: MouseEvent<HTMLElement>) => {
            if (!disableBackdropClick) {
                handleClose(event, 'backdropClick');
            }
        };

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

        const handleEntered: Required<TransitionProps>['onEntered'] = useCallback(
            (node, isAppearing) => {
                scrollableNodeRef.current =
                    scrollHandler === 'content' ? componentRef.current : wrapperRef.current;

                addResizeHandle();

                if (scrollableNodeRef.current) {
                    scrollableNodeRef.current.addEventListener('scroll', handleScroll);
                    handleScroll();
                }

                if (transitionProps.onEntered) {
                    transitionProps.onEntered(node, isAppearing);
                }

                if (onMount) onMount();
            },
            [addResizeHandle, handleScroll, onMount, scrollHandler, transitionProps],
        );

        const handleExited: Required<TransitionProps>['onExited'] = useCallback(
            node => {
                removeResizeHandle();

                setExited(true);

                if (scrollableNodeRef.current) {
                    scrollableNodeRef.current.removeEventListener('scroll', handleScroll);
                }

                if (transitionProps.onExited) {
                    transitionProps.onExited(node);
                }

                if (onUnmount) onUnmount();
            },
            [handleScroll, onUnmount, removeResizeHandle, transitionProps],
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

        const contextValue = useMemo<BaseModalContext>(
            () => ({
                hasHeader,
                hasFooter,
                hasScroll,
                headerHighlighted,
                footerHighlighted,
                contentRef,
                setHasHeader,
                setHasFooter,
                onClose: handleClose,
            }),
            [hasHeader, hasFooter, hasScroll, headerHighlighted, footerHighlighted, handleClose],
        );

        if (!shouldRender) return null;

        return (
            <Portal getPortalContainer={container}>
                <BaseModalContext.Provider value={contextValue}>
                    <FocusLock
                        autoFocus={!disableAutoFocus}
                        disabled={disableFocusLock || !open}
                        returnFocus={!disableRestoreFocus}
                    >
                        <div
                            role='dialog'
                            className={cn(styles.wrapper, wrapperClassName, {
                                [styles.hidden]: !open && exited,
                            })}
                            ref={mergeRefs([ref, wrapperRef])}
                            onKeyDown={handleKeyDown}
                            tabIndex={-1}
                            data-test-id={dataTestId}
                        >
                            {Backdrop && (
                                <Backdrop
                                    {...backdropProps}
                                    open={open}
                                    onClick={handleBackdropClick}
                                />
                            )}
                            <CSSTransition
                                appear={true}
                                timeout={200}
                                classNames={styles}
                                {...transitionProps}
                                in={open}
                                onEntered={handleEntered}
                                onExited={handleExited}
                            >
                                <div className={cn(styles.component, className)} ref={componentRef}>
                                    <div className={cn(styles.content, contentClassName)}>
                                        {children}
                                    </div>
                                </div>
                            </CSSTransition>
                        </div>
                    </FocusLock>
                </BaseModalContext.Provider>
            </Portal>
        );
    },
);
