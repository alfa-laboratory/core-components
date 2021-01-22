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
} from 'react';

import { CSSTransition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';

import { CrossHeavyMIcon } from '@alfalab/icons-glyph';
import { useMatchMedia } from '@alfalab/core-components-mq';
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
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;

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
};

// FIXME: без явного указания типа возникает ts(4023)
export const Modal: FC<ModalProps> & RefAttributes<HTMLDivElement> = forwardRef<
    HTMLDivElement,
    ModalProps
>(
    (
        {
            transitionProps,
            children,
            footer,
            fullscreen,
            hasCloser = true,
            onBackdropClick,
            onClose,
            onEscapeKeyDown,
            open,
            size = 'm',
            className,
            wrapperClassName,
            ...restProps
        },
        ref,
    ) => {
        const [highlightCloser, setHighlightCloser] = useState(false);
        const [highlightFooter, setHighlightFooter] = useState(false);

        const contentRef = useRef<HTMLDivElement>(null);

        const [small] = useMatchMedia('screen and (max-width: 767px)');

        const handleHighlights = useCallback(() => {
            if (contentRef.current) {
                setHighlightCloser(small && isScrolledToTop(contentRef.current) === false);
                setHighlightFooter(small && isScrolledToBottom(contentRef.current) === false);
            }
        }, [small]);

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

        const handleEnter = useCallback(() => {
            if (contentRef.current) {
                contentRef.current.addEventListener('scroll', handleHighlights);
                handleHighlights();
            }
        }, [handleHighlights]);

        const handleExit = useCallback(() => {
            if (contentRef.current) {
                contentRef.current.removeEventListener('scroll', handleHighlights);
            }
        }, [handleHighlights]);

        return (
            <BaseModal
                open={open}
                onClose={handleClose}
                ref={ref}
                className={cn(styles.wrapper, wrapperClassName, {
                    [styles.noPaddings]: fullscreen || small,
                })}
                {...restProps}
            >
                <CSSTransition
                    appear={true}
                    timeout={200}
                    classNames={styles}
                    {...transitionProps}
                    in={open}
                    onEnter={handleEnter}
                    onExit={handleExit}
                >
                    <div
                        className={cn(styles.component, className, styles[size], {
                            [styles.fullscreen]: fullscreen,
                            [styles.small]: small,
                        })}
                    >
                        <div
                            className={cn(styles.flexContainer, {
                                [styles.flexContainerSmall]: small,
                            })}
                        >
                            <div
                                className={cn(styles.content, className, {
                                    [styles.contentSmall]: small,
                                })}
                                ref={contentRef}
                            >
                                {children}
                            </div>

                            {footer && (
                                <div
                                    className={cn(styles.footer, {
                                        [styles.footerSmall]: small,
                                        [styles.footerHighlight]: highlightFooter,
                                    })}
                                >
                                    {footer}
                                </div>
                            )}

                            {hasCloser && (
                                <div
                                    className={cn(styles.closerWrapper, {
                                        [styles.closerWrapperHighlight]: highlightCloser,
                                    })}
                                >
                                    <Button
                                        type='button'
                                        view='ghost'
                                        className={cn([styles.closer], {
                                            [styles.closerSmall]: small,
                                        })}
                                        aria-label='закрыть'
                                        onClick={handleCloserClick}
                                    >
                                        <CrossHeavyMIcon />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CSSTransition>
            </BaseModal>
        );
    },
);
