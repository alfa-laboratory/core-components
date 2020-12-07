import cn from 'classnames';
import React, {
    useEffect, useCallback, useRef, useState, forwardRef,
} from 'react';
import {use100vh} from 'react-div-100vh';

import { useEventCallback } from '@alfalab/hooks';
import { CrossHeavyMIcon } from '@alfalab/icons-glyph';

import { Portal, PortalProps } from '@alfalab/core-components-portal';
import { TrapFocus } from '@alfalab/core-components-trap-focus';
import { useMatchMedia } from '@alfalab/core-components-mq';

import {
    ComponentTransitionsProps,
    createChainedFunction,
    getContainer,
    getHasTransition,
    ownerDocument,
    useForkRef,
} from './utils';

import { ariaHidden, ModalElement, ModalManager } from './Component.manager';
import { SimpleBackdrop, SimpleBackdropProps } from './SimpleBackdrop';

import styles from './index.module.css';

const defaultManager = new ModalManager();

export type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
    /**
     * Бэкдроп компонент. Позволяет отрендерить кастомный оверлей
     * @default SimpleBackdrop
     */
    backdropComponent?: React.ElementType;

    /**
     * Свойства для Бэкдропа
     * @default timeout: 200, appear: true
     */
    backdropProps?: Partial<SimpleBackdropProps>;

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
    container?: PortalProps['container'];

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
     * Отключает поведение портала.
     *
     * Дочерние элементы остаются внутри DOM
     * @default false
     */
    disablePortal?: PortalProps['disablePortal'];

    /**
     * Отключает восстановление фокуса на предыдущем элементе после закрытия модалки
     * @default false
     */
    disableRestoreFocus?: boolean;

    /**
     * Блокирует скролл
     * @default false
     */
    disableScrollLock?: boolean;

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
        (event: React.SyntheticEvent, reason: 'backdropClick' | 'escapeKeyDown' | 'closerClick'): void;
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

const highlightSetter = (
    refObject: React.MutableRefObject<boolean>,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
) => (highlight: boolean) => {
    // eslint-disable-next-line no-param-reassign
    refObject.current = highlight;
    setter(highlight);
};

const getIsScrolledFromTop = (target: HTMLElement) => target.scrollTop > 0;

const getIsScrolledToBottom = (target: HTMLElement) =>
    (target.scrollHeight - target.offsetHeight) === (target.scrollTop);

/**
 *
 * Заимствовано из  [MUI Modal](https://material-ui.com/components/modal/).
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
    const {
        backdropComponent: BackdropComponent = SimpleBackdrop,
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
        disablePortal = false,
        disableRestoreFocus = false,
        disableScrollLock = false,
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
    const handleRef = useForkRef(modalRef, ref);
    const contentRef = useRef<HTMLDivElement>(null);
    const hasTransition = getHasTransition(children);
    const height = use100vh() ?? '100vh';
    const [isSmall] = useMatchMedia('screen and (max-width: 47.9375em)');

    const getDoc = () => ownerDocument(mountNodeRef.current);
    const getModal = () => {
        modal.current.modalRef = modalRef.current;
        modal.current.mountNode = mountNodeRef.current;
        return modal.current;
    };

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

            if (isScrolledFromTop !== highlightCloserRef.current || isScrolledToBottom === highlightFooterRef.current) {
                setHighlightCloser(isScrolledFromTop);
                setHighlightFooter(!isScrolledToBottom);
            }
        }
    });

    const shouldHighlightCloser = highlightCloser && isSmall;
    const shouldHighlightFooter = highlightFooter && isSmall;

    const handleMounted = () => {
        manager.mount(getModal(), { disableScrollLock });

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

    const isTopModal = useCallback(() => manager.isTopModal(getModal()), [manager]);

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

        if (contentRef.current) {
            return () => contentRef.current?.removeEventListener('scroll', handleModalContentElementScroll);
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
        } else if (!hasTransition || !closeAfterTransition) {
            handleClose();
        }
    }, [open, handleClose, hasTransition, closeAfterTransition, handleOpen]);


    if (!keepMounted && !open && (!hasTransition || exited)) {
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

    const childProps: {
        tabIndex?: number;
    } & ComponentTransitionsProps = {};

    if (React.isValidElement(children)) {
        if (children.props.tabIndex === undefined) {
            childProps.tabIndex = -1;
        }

        if (hasTransition) {
            childProps.appear = true;
            childProps.onEnter = createChainedFunction(handleEnter, children.props.onEnter);

            if (targetHandleExited === 'children') {
                childProps.onExited = createChainedFunction(handleExited, children.props.onExited);
            }
        }
    }

    if (targetHandleExited === 'backdrop') {
        backdropProps.onExited = createChainedFunction(handleExited, backdropProps.onExited);
    }

    return (
        <Portal ref={handlePortalRef} container={container} disablePortal={disablePortal}>
            <div style={{height}}>
                <div
                    data-test-id={dataTestId}
                    onKeyDown={handleKeyDown}
                    role="presentation"
                    className={cn(styles.wrapper, {
                        [styles.hidden]: !open && exited,
                        [styles.wrapper_fullscreen]: fullscreen,
                        [styles.wrapper_small]: isSmall,
                    })}
                    ref={handleRef}
                >
                    { hideBackdrop ? null : (
                        <BackdropComponent
                            open={open}
                            onClick={handleBackdropClick}
                            {...backdropProps}
                        />
                    ) }

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
                            <div className={cn(styles['flex-container'], {
                                [`${styles['flex-container_small']}`]: isSmall,
                            })}>
                                <div
                                    style={style}
                                    className={cn(styles.content, className, {
                                        [styles.content_small]: isSmall,
                                    })}
                                    ref={contentRef}
                                >
                                    { React.isValidElement(children)
                                        ? React.cloneElement(children, childProps)
                                        : children }
                                </div>

                                { footer && (
                                    <div className={cn(styles.footer, {
                                                [styles.footer_small]: isSmall,
                                                [styles.footer_highlight]: shouldHighlightFooter,
                                    })}>
                                        { footer }
                                    </div>
                                ) }

                                { hasCloser && (
                                    <div className={cn(styles['closer-wrapper'], {
                                                [styles['closer-wrapper_highlight']]: shouldHighlightCloser,
                                    })}>
                                        <button
                                            type="button"
                                            className={cn([styles.closer], {
                                                        [styles.closer_small]: isSmall,
                                                    })}
                                            onClick={handleCloserClick}
                                        >
                                            <CrossHeavyMIcon />
                                        </button>
                                    </div>
                                ) }
                            </div>
                        </div>
                    </TrapFocus>
                </div>
            </div>
        </Portal>
    );
});
