import cn from 'classnames';
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
} from 'react';
import mergeRefs from 'react-merge-refs';
import { CSSTransition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';

import { Button } from '@alfalab/core-components-button';

import { isScrolledToBottom, isScrolledToTop } from './utils';
import { BaseModal, BaseModalProps } from './components/base-modal';

import styles from './index.module.css';

export type ModalProps = Omit<BaseModalProps, 'onClose'> & {
    /**
     * Ширина модального окна
     * @default "m"
     */
    size?: 's' | 'm' | 'l';

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для хэдера
     */
    headerClassName?: string;

    /**
     * Дополнительный класс для контента
     */
    contentClassName?: string;

    /**
     * Дополнительный класс для футера
     */
    footerClassName?: string;

    /**
     * Дополнительный класс для крестика
     */
    closerClassName?: string;

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
     * Контент футера, на мобильных устройствах содержимое футера прижимается к нижней части вьюпорта
     */
    footer?: ReactNode;

    /**
     * Заставляет футер прилипать к нижнему краю экрана при прокрутке
     */
    stickyFooter?: boolean;

    /**
     * Заставляет хэдер прилипать к верхнему краю экрана при прокрутке
     */
    stickyHeader?: boolean;

    /**
     * Заголовок модального окна
     */
    headerContent?: ReactNode;

    /**
     * Делает шапку прозрачной
     */
    transparentHeader?: boolean;

    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;

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
};

// FIXME: без явного указания типа возникает ts(4023)
export const Modal: FC<ModalProps & RefAttributes<HTMLDivElement>> = forwardRef<
    HTMLDivElement,
    ModalProps
>(
    (
        {
            Transition = CSSTransition,
            transitionProps = {},
            children,
            footer,
            headerContent,
            fullscreen,
            hasCloser = true,
            open,
            stickyFooter = false,
            stickyHeader = false,
            transparentHeader = hasCloser && !headerContent,
            size,
            className,
            footerClassName,
            headerClassName,
            contentClassName,
            wrapperClassName,
            closerClassName,
            onBackdropClick,
            onClose,
            onEscapeKeyDown,
            onMount,
            onUnmount,
            ...restProps
        },
        ref,
    ) => {
        const [highlightHeader, setHighlightHeader] = useState(false);
        const [highlightFooter, setHighlightFooter] = useState(false);

        const modalRef = useRef<HTMLDivElement>(null);

        const shouldRenderHeader = hasCloser || headerContent;
        const shouldHightlightHeader = shouldRenderHeader && (stickyHeader || fullscreen);
        const shouldHightlightFooter = footer && stickyFooter;
        const shouldHandleScroll = shouldHightlightHeader || shouldHightlightFooter;

        const handleScroll = useCallback(() => {
            if (!modalRef.current) return;

            if (shouldHightlightHeader) {
                setHighlightHeader(isScrolledToTop(modalRef.current) === false);
            }

            if (shouldHightlightFooter) {
                setHighlightFooter(isScrolledToBottom(modalRef.current) === false);
            }
        }, [shouldHightlightFooter, shouldHightlightHeader]);

        const handleClose = useCallback<Required<ModalProps>['onClose']>(
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

        const handleEntered: TransitionProps['onEntered'] = useCallback(
            (node, isAppearing) => {
                if (shouldHandleScroll && modalRef.current) {
                    modalRef.current.addEventListener('scroll', handleScroll);
                    handleScroll();
                }

                if (transitionProps.onEnter) {
                    transitionProps.onEnter(node, isAppearing);
                }

                if (onMount) onMount();
            },
            [handleScroll, onMount, shouldHandleScroll, transitionProps],
        );

        const handleExited: TransitionProps['onExited'] = useCallback(
            node => {
                if (shouldHandleScroll && modalRef.current) {
                    modalRef.current.removeEventListener('scroll', handleScroll);
                }

                if (transitionProps.onExited) {
                    transitionProps.onExited(node);
                }

                if (onUnmount) onUnmount();
            },
            [handleScroll, onUnmount, shouldHandleScroll, transitionProps],
        );

        return (
            <BaseModal
                open={open}
                onClose={handleClose}
                ref={mergeRefs([modalRef, ref])}
                className={cn(styles.wrapper, wrapperClassName, {
                    [styles.wrapperFullscreen]: fullscreen,
                })}
                {...restProps}
            >
                <Transition
                    appear={true}
                    timeout={200}
                    classNames={styles}
                    {...transitionProps}
                    in={open}
                    onEntered={handleEntered}
                    onExited={handleExited}
                >
                    <div
                        className={cn(styles.component, className, size && styles[size], {
                            [styles.fullscreen]: fullscreen,
                        })}
                    >
                        {shouldRenderHeader && (
                            <div
                                className={cn(
                                    styles.header,
                                    headerClassName,
                                    size && styles[`header-${size}`],
                                    {
                                        [styles.headerHighlight]: highlightHeader,
                                        [styles.stickyHeader]: stickyHeader || fullscreen,
                                        [styles.onlyCloserHeader]: hasCloser && !headerContent,
                                        [styles.transparentHeader]: transparentHeader,
                                    },
                                )}
                            >
                                <div className={styles.headerContent}>{headerContent}</div>

                                {hasCloser && (
                                    <Button
                                        type='button'
                                        view='ghost'
                                        className={cn(styles.closer, closerClassName)}
                                        aria-label='закрыть'
                                        onClick={handleCloserClick}
                                    />
                                )}
                            </div>
                        )}

                        <div
                            className={cn(
                                styles.content,
                                size && styles[`content-${size}`],
                                contentClassName,
                            )}
                        >
                            {children}
                        </div>

                        {footer && (
                            <div
                                className={cn(
                                    styles.footer,
                                    footerClassName,
                                    size && styles[`footer-${size}`],
                                    {
                                        [styles.stickyFooter]: stickyFooter,
                                        [styles.footerHighlight]: highlightFooter,
                                    },
                                )}
                            >
                                {footer}
                            </div>
                        )}
                    </div>
                </Transition>
            </BaseModal>
        );
    },
);
