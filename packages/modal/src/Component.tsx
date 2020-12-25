import cn from 'classnames';
import React, { useEffect, useCallback, useRef, useState, forwardRef } from 'react';
import { use100vh } from 'react-div-100vh';
import mergeRefs from 'react-merge-refs';

import { useEventCallback } from '@alfalab/hooks';
import { CrossHeavyMIcon } from '@alfalab/icons-glyph';
import { Portal, PortalProps } from '@alfalab/core-components-portal';
import { TrapFocus } from '@alfalab/core-components-trap-focus';
import { useMatchMedia } from '@alfalab/core-components-mq';

import {
    createChainedFunction,
    getContainer,
    ownerDocument,
    highlightSetter,
    getIsScrolledFromTop,
    getIsScrolledToBottom,
    ariaHidden,
} from './utils';

import { ModalElement, ModalManager } from './Component.manager';
import { Backdrop, BackdropProps } from './components/backdrop';

import styles from './index.module.css';

const defaultManager = new ModalManager();

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
    /**
     * Бэкдроп компонент. Позволяет отрендерить кастомный оверлей
     * @default Backdrop
     */
    backdropComponent?: React.ElementType;

    /**
     * Свойства для Бэкдропа
     * @default timeout: 200, appear: true
     */
    backdropProps?: Partial<BackdropProps>;

    /**
     * Когда `true` модальное окно закрывается после анимации
     * @default false
     */
    closeAfterTransition?: boolean;

    /**
     * Нода, компонент или функция возвращающая их
     *
     * Контейнер к которому будут добавляться порталы
     */
    container?: PortalProps['getPortalContainer'];

    /**
     * Отключает автоматический перевод фокуса на модалку при открытии, и
     * переключать его обратно после закрытия.
     *
     * В большинстве случаев этот параметр не должен устанавливаться в `true`,
     * так как модалка перестаёт отвечать требованиям доступности, например для скринридеров.
     * @default false
     */
    disableAutoFocus?: boolean;

    /**
     * Отключает вызов `callback` при клике на бэкдроп
     * @default false
     */
    disableBackdropClick?: boolean;

    /**
     * Отключает ограничение перевода фокуса в пределах модалки
     *
     * В большинстве случаев этот параметр не должен устанавливаться в `true`,
     * так как модалка перестаёт отвечать требованиям доступности, например для скринридеров.
     * @default false
     */
    disableEnforceFocus?: boolean;

    /**
     * Отключает вызов `callback` при нажатии Escape
     * @default false
     */
    disableEscapeKeyDown?: boolean;

    /**
     * Отключает восстановление фокуса на предыдущем элементе после закрытия модалки
     * @default false
     */
    disableRestoreFocus?: boolean;

    /**
     * Контент футера, на мобильных устройствах содержимое футера прижимается к нижней части вьюпорта
     */
    footer?: React.ReactNode;

    /**
     * Управление возможностью сделать модальное окно на весь экран
     * @default false
     */
    fullscreen?: boolean;

    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;

    /**
     * Отключает рендер бэкдропа
     * @default false
     */
    hideBackdrop?: boolean;

    /**
     * Содержимое модалки всегда в DOM
     * @default false
     */
    keepMounted?: boolean;

    /** @ignore */
    manager?: ModalManager;

    /** Обработчик события нажатия на бэкдроп */
    onBackdropClick?: React.ReactEventHandler;

    /**
     * Обработчик события закрытия
     *
     * Может регулировать параметром `reason`
     *
     * @param {object} event
     * @param {string}`"escapeKeyDown"`, `"backdropClick"`, `"closerClick"`.
     */
    onClose?: {
        (
            event: React.SyntheticEvent,
            reason: 'backdropClick' | 'escapeKeyDown' | 'closerClick',
        ): void;
    };

    /**
     * Обработчик события нажатия на Escape
     *
     * Если `disableEscapeKeyDown` - false и модальное окно в фокусе
     */
    onEscapeKeyDown?: React.ReactEventHandler;

    /** Открывает модальное окно */
    open: boolean;

    /**
     * Ширина модального окна
     * @default "m"
     */
    size?: 's' | 'm' | 'l';

    /**
     * Компонент, в который передаётся обработчик на завершение анимаиции закрытия
     *
     * Нужно, если анимация для `Backdrop` происходит с задержкой
     * @default "children"
     */
    targetHandleExited?: 'children' | 'backdrop';

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

/**
 *
 * Заимствовано из  [MUI Modal](https://material-ui.com/components/modal/).
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
    const {
        backdropComponent: BackdropComponent = Backdrop,
        backdropProps = {
            timeout: 200,
            appear: true,
        },
        children,
        closeAfterTransition = false,
        container,
        disableAutoFocus = false,
        disableBackdropClick = false,
        disableEnforceFocus = false,
        disableEscapeKeyDown = false,
        disableRestoreFocus = false,
        footer,
        fullscreen,
        hasCloser,
        hideBackdrop = false,
        keepMounted = false,
        manager = defaultManager,
        onBackdropClick,
        onClose,
        onEscapeKeyDown,
        open,
        size = 'm',
        targetHandleExited = 'children',
        dataTestId,
        style,
        className,
    } = props;

    const [exited, setExited] = useState(true);
    const modal = useRef<ModalElement>({} as ModalElement);
    const mountNodeRef = useRef<HTMLDivElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const handleRef = mergeRefs([modalRef, ref]);
    const contentRef = useRef<HTMLDivElement>(null);
    const height = use100vh() || '100vh';
    const [isSmall] = useMatchMedia('screen and (max-width: 47.9375em)');

    const getDoc = () => ownerDocument(mountNodeRef.current);
    const getModal = () => {
        modal.current.modalRef = modalRef.current;
        modal.current.mountNode = mountNodeRef.current;
        return modal.current;
    };
    const isTopModal = useCallback(() => manager.isTopModal(getModal()), [manager]);

    const [highlightCloser, _setHighlightCloser] = useState(false);
    const highlightCloserRef = useRef(highlightCloser);
    const setHighlightCloser = highlightSetter(highlightCloserRef, _setHighlightCloser);

    const [highlightFooter, _setHighlightFooter] = useState(false);
    const highlightFooterRef = useRef(highlightCloser);
    const setHighlightFooter = highlightSetter(highlightFooterRef, _setHighlightFooter);

    const handleModalContentElementScroll = useEventCallback((event: Event) => {
        if (event.target instanceof HTMLElement) {
            const isScrolledFromTop = getIsScrolledFromTop(event.target);
            const isScrolledToBottom = getIsScrolledToBottom(event.target);

            if (
                isScrolledFromTop !== highlightCloserRef.current ||
                isScrolledToBottom === highlightFooterRef.current
            ) {
                setHighlightCloser(isScrolledFromTop);
                setHighlightFooter(!isScrolledToBottom);
            }
        }
    });

    const shouldHighlightCloser = highlightCloser && isSmall;
    const shouldHighlightFooter = highlightFooter && isSmall;

    const handleMounted = () => {
        manager.mount(getModal());

        // Fix a bug on Chrome where the scroll isn't initially 0.
        if (modalRef.current) {
            modalRef.current.scrollTop = 0;
        }

        if (contentRef.current) {
            contentRef.current.addEventListener('scroll', handleModalContentElementScroll);

            const isScrolledToBottom = getIsScrolledToBottom(contentRef.current);
            setHighlightFooter(!isScrolledToBottom);
        }
    };

    const handleOpen = useEventCallback(() => {
        const resolvedContainer = getContainer(container) || getDoc().body;

        manager.add(getModal(), resolvedContainer);

        // Элемент был уже смонтирован
        if (modalRef.current) {
            handleMounted();
        }
    });

    const handlePortalRef = useEventCallback((node: HTMLDivElement) => {
        mountNodeRef.current = node;

        if (!node) {
            return;
        }

        if (open && isTopModal()) {
            handleMounted();
        } else if (modalRef.current) {
            ariaHidden(modalRef.current, true);
        }
    });

    const handleClose = useCallback(() => {
        manager.remove(getModal());

        if (contentRef.current !== null) {
            // TODO: заменить на optional chaining
            return () =>
                (contentRef.current as HTMLDivElement).removeEventListener(
                    'scroll',
                    handleModalContentElementScroll,
                );
        }

        return null;
    }, [handleModalContentElementScroll, manager]);

    useEffect(() => {
        if (keepMounted && modalRef.current) {
            ariaHidden(modalRef.current, !(open || isTopModal()));
        }
        // eslint-disable-next-line
    }, [modalRef]);

    useEffect(() => {
        if (contentRef.current) {
            const isScrolledToBottom = getIsScrolledToBottom(contentRef.current);
            setHighlightFooter(!isScrolledToBottom);
        }
    }, [handleModalContentElementScroll, setHighlightFooter]);

    useEffect(
        () => () => {
            handleClose();
        },
        [handleClose],
    );

    useEffect(() => {
        if (open) {
            handleOpen();
        } else if (!closeAfterTransition) {
            handleClose();
        }
    }, [open, handleClose, closeAfterTransition, handleOpen]);

    if (!keepMounted && !open && exited) {
        return null;
    }

    const handleEnter = () => {
        setExited(false);
    };

    const handleExited = () => {
        setExited(true);

        if (closeAfterTransition) {
            handleClose();
        }
    };

    const handleBackdropClick = (event: React.MouseEvent) => {
        if (event.target !== event.currentTarget) {
            return;
        }

        if (onBackdropClick) {
            onBackdropClick(event);
        }

        if (!disableBackdropClick && onClose) {
            onClose(event, 'backdropClick');
        }
    };

    const handleCloserClick = (event: React.MouseEvent) => {
        if (onClose) {
            onClose(event, 'closerClick');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        /*
         * Обработчик не устанавливает event.preventDefault()
         * что бы сохранить дефолтное поведение элементов и событий форм.
         */
        if (event.key !== 'Escape' || !isTopModal()) {
            return;
        }

        // Если есть обработчик escape на body
        event.stopPropagation();

        if (onEscapeKeyDown) {
            onEscapeKeyDown(event);
        }

        if (!disableEscapeKeyDown && onClose) {
            onClose(event, 'escapeKeyDown');
        }
    };

    const childProps: { tabIndex?: number } = {};
    if (React.isValidElement(children)) {
        if (children.props.tabIndex === undefined) {
            childProps.tabIndex = -1;
        }
    }

    if (targetHandleExited === 'backdrop') {
        backdropProps.onExited = createChainedFunction(handleExited, backdropProps.onExited);
    }

    return (
        <Portal ref={handlePortalRef} getPortalContainer={container}>
            <div style={{ height }}>
                <div
                    data-test-id={dataTestId}
                    onKeyDown={handleKeyDown}
                    role='presentation'
                    className={cn(styles.wrapper, {
                        [styles.hidden]: !open && exited,
                        [styles.wrapper_fullscreen]: fullscreen,
                        [styles.wrapper_small]: isSmall,
                    })}
                    ref={handleRef}
                >
                    {hideBackdrop ? null : (
                        <BackdropComponent
                            open={open}
                            onClick={handleBackdropClick}
                            onEnter={handleEnter}
                            onExited={handleExited}
                            {...backdropProps}
                        />
                    )}

                    <TrapFocus
                        disableEnforceFocus={disableEnforceFocus}
                        disableAutoFocus={disableAutoFocus}
                        disableRestoreFocus={disableRestoreFocus}
                        getDoc={getDoc}
                        isEnabled={isTopModal}
                        open={open}
                    >
                        <div
                            tabIndex={-1}
                            className={cn(styles.modal, styles[`modal_size_${size}`], {
                                [styles.modal_fullscreen]: fullscreen,
                                [styles.modal_small]: isSmall,
                            })}
                        >
                            <div
                                className={cn(styles['flex-container'], {
                                    [`${styles['flex-container_small']}`]: isSmall,
                                })}
                            >
                                <div
                                    style={style}
                                    className={cn(styles.content, className, {
                                        [styles.content_small]: isSmall,
                                    })}
                                    // сюда стили для транзишна контента
                                    ref={contentRef}
                                >
                                    {React.isValidElement(children)
                                        ? React.cloneElement(children, childProps)
                                        : children}
                                </div>

                                {footer && (
                                    <div
                                        className={cn(styles.footer, {
                                            [styles.footer_small]: isSmall,
                                            [styles.footer_highlight]: shouldHighlightFooter,
                                        })}
                                    >
                                        {footer}
                                    </div>
                                )}

                                {hasCloser && (
                                    <div
                                        className={cn(styles['closer-wrapper'], {
                                            [styles[
                                                'closer-wrapper_highlight'
                                            ]]: shouldHighlightCloser,
                                        })}
                                    >
                                        <button
                                            type='button'
                                            className={cn([styles.closer], {
                                                [styles.closer_small]: isSmall,
                                            })}
                                            onClick={handleCloserClick}
                                        >
                                            <CrossHeavyMIcon />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TrapFocus>
                </div>
            </div>
        </Portal>
    );
});
