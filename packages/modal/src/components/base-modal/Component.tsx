import React, {
    useCallback,
    useRef,
    useState,
    forwardRef,
    MouseEvent,
    KeyboardEvent,
    FC,
    RefAttributes,
    ReactNode,
    ElementType,
    useEffect,
    isValidElement,
    cloneElement,
} from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { CSSTransition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import FocusLock from 'react-focus-lock';

import { Portal, PortalProps } from '@alfalab/core-components-portal';

import { handleContainer, isScrolledToBottom, isScrolledToTop } from '../../utils';

import styles from './index.module.css';

export type BaseModalProps = {
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
     * Дополнительный класс для контента
     */
    contentClassName?: string;

    /**
     * Дополнительный класс для обертки (BaseModal)
     */
    wrapperClassName?: string;

    /**
     * Управление возможностью сделать модальное окно на весь экран
     * @default false
     */
    fullscreen?: boolean;

    /**
     * Шапка модального окна
     */
    header?: ReactNode;

    /**
     * Заставляет хэдер прилипать к верхнему краю экрана при прокрутке
     */
    highlightHeader?: boolean;

    /**
     * Контент футера, на мобильных устройствах содержимое футера прижимается к нижней части вьюпорта
     */
    footer?: ReactNode;

    /**
     * Заставляет футер прилипать к нижнему краю экрана при прокрутке
     */
    highlightFooter?: boolean;

    /**
     * Компонент анимации модалки
     * @default CSSTransition
     */
    Transition?: ElementType;

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
        reason: 'backdropClick' | 'escapeKeyDown' | 'closerClick',
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
     * Обработчик подсветки хедера при скролле
     */
    onHeaderHighlight?: (highlighted: boolean) => void;

    /**
     * Обработчик подсветки футера при скролле
     */
    onFooterHighlight?: (highlighted: boolean) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

// FIXME: без явного указания типа возникает ts(4023)
export const BaseModal: FC<BaseModalProps & RefAttributes<HTMLDivElement>> = forwardRef<
    HTMLDivElement,
    BaseModalProps
>(
    (
        {
            open,
            container,
            children,
            footer,
            header,
            fullscreen,
            highlightHeader = false,
            highlightFooter = false,
            hideBackdrop = false,
            backdropProps = {},
            Transition = CSSTransition,
            transitionProps = {},
            disableAutoFocus = false,
            disableBackdropClick = false,
            disableFocusLock = false,
            disableEscapeKeyDown = false,
            disableRestoreFocus = false,
            keepMounted = false,
            targetHandleExited = hideBackdrop ? 'children' : 'backdrop',
            className,
            contentClassName,
            wrapperClassName,
            onBackdropClick,
            onClose,
            onEscapeKeyDown,
            onMount,
            onUnmount,
            onHeaderHighlight,
            onFooterHighlight,
            dataTestId,
        },
        ref,
    ) => {
        const [exited, setExited] = useState(!open);
        const restoreContainerStyles = useRef<null | Function>(null);

        const wrapperRef = useRef<HTMLDivElement>(null);
        const contentRef = useRef<HTMLDivElement>(null);

        const scrollableNodeRef = useRef<HTMLDivElement | null>(null);

        const shouldHighlightHeader = header && highlightHeader;
        const shouldHighlightFooter = footer && highlightFooter;
        const shouldHandleScroll = shouldHighlightHeader || shouldHighlightFooter;

        const shouldRender = keepMounted || open || !exited;

        const handleScroll = useCallback(() => {
            if (!scrollableNodeRef.current) return;

            if (shouldHighlightHeader && onHeaderHighlight) {
                onHeaderHighlight(isScrolledToTop(scrollableNodeRef.current) === false);
            }

            if (shouldHighlightFooter && onFooterHighlight) {
                onFooterHighlight(isScrolledToBottom(scrollableNodeRef.current) === false);
            }
        }, [onFooterHighlight, onHeaderHighlight, shouldHighlightFooter, shouldHighlightHeader]);

        const handleClose = useCallback<Required<BaseModalProps>['onClose']>(
            (event, reason) => {
                if (onClose) onClose(event, reason);

                if (reason === 'backdropClick' && onBackdropClick)
                    onBackdropClick(event as MouseEvent);

                if (reason === 'escapeKeyDown' && onEscapeKeyDown)
                    onEscapeKeyDown(event as KeyboardEvent);

                return null;
            },
            [onBackdropClick, onClose, onEscapeKeyDown],
        );

        const handleCloserClick = useCallback(
            (event: MouseEvent<HTMLButtonElement>) => {
                handleClose(event, 'closerClick');
            },
            [handleClose],
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
                 * Обработчик не устанавливает event.preventDefault()
                 * что бы сохранить дефолтное поведение элементов и событий форм.
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

        const handleEntered: TransitionProps['onEntered'] = useCallback(
            (node, isAppearing) => {
                if (shouldHandleScroll) {
                    scrollableNodeRef.current = fullscreen
                        ? contentRef.current
                        : wrapperRef.current;

                    if (scrollableNodeRef.current) {
                        scrollableNodeRef.current.addEventListener('scroll', handleScroll);
                        handleScroll();
                    }
                }

                if (transitionProps.onEnter) {
                    transitionProps.onEnter(node, isAppearing);
                }

                if (onMount) onMount();
            },
            [fullscreen, handleScroll, onMount, shouldHandleScroll, transitionProps],
        );

        const handleExited: TransitionProps['onExited'] = useCallback(
            node => {
                if (shouldHandleScroll && scrollableNodeRef.current) {
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
            [handleScroll, onUnmount, shouldHandleScroll, targetHandleExited, transitionProps],
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

        if (!shouldRender) return null;

        return (
            <Portal getPortalContainer={container}>
                <FocusLock
                    autoFocus={!disableAutoFocus}
                    disabled={disableFocusLock || !open}
                    returnFocus={!disableRestoreFocus}
                >
                    <CSSTransition
                        in={open}
                        appear={true}
                        timeout={200}
                        classNames={styles}
                        onExited={handleBackdropExited}
                        {...backdropProps}
                    >
                        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                        <div
                            role='dialog'
                            className={cn(styles.wrapper, wrapperClassName, {
                                [styles.hidden]: !open && exited,
                                [styles.fullscreen]: fullscreen,
                                [styles.hideBackdrop]: hideBackdrop,
                            })}
                            ref={mergeRefs([wrapperRef, ref])}
                            onKeyDown={handleKeyDown}
                            tabIndex={-1}
                            data-test-id={dataTestId}
                            onClick={handleBackdropClick}
                        >
                            <Transition
                                appear={true}
                                timeout={200}
                                {...transitionProps}
                                in={open}
                                onEntered={handleEntered}
                                onExited={handleExited}
                            >
                                <div className={cn(styles.component, className)}>
                                    {isValidElement(header)
                                        ? cloneElement(header, {
                                              onCloserClick: handleCloserClick,
                                          })
                                        : header}

                                    <div
                                        className={cn(styles.content, contentClassName)}
                                        ref={contentRef}
                                    >
                                        {children}
                                    </div>

                                    {footer}
                                </div>
                            </Transition>
                        </div>
                    </CSSTransition>
                </FocusLock>
            </Portal>
        );
    },
);
