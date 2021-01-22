import React, {
    useCallback,
    forwardRef,
    ReactNode,
    MouseEvent,
    KeyboardEvent,
    ElementType,
    useState,
    cloneElement,
    isValidElement,
    useEffect,
    useRef,
} from 'react';
import FocusLock from 'react-focus-lock';
import cn from 'classnames';

import { Portal, PortalProps } from '@alfalab/core-components-portal';

import { handleContainer } from '../../utils';
import { Backdrop, BackdropProps } from '../backdrop';

import styles from './index.module.css';

export type BaseModalProps = {
    /**
     * Контент
     */
    children?: ReactNode;

    /**
     * Бэкдроп компонент. Позволяет отрендерить кастомный оверлей
     * @default Backdrop
     */
    backdropComponent?: ElementType;

    /**
     * Свойства для Бэкдропа
     * @default timeout: 200, appear: true
     */
    backdropProps?: Partial<BackdropProps>;

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
     * Отключает рендер бэкдропа
     * @default false
     */
    hideBackdrop?: boolean;

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
     * Указывает, что внутренний контент (children) использует анимацию
     */
    withTransition?: boolean;

    /**
     * Указывает, когда вызывать коллбэк закрытия — при закрытии бэкдропа или самого контента
     */
    targetHandleExited?: 'children' | 'backdrop';

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Обработчик закрытия
     */
    onClose?: (
        event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
        reason: 'backdropClick' | 'escapeKeyDown',
    ) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const BaseModal = forwardRef<HTMLDivElement, BaseModalProps>(
    (
        {
            backdropComponent: BackdropComponent = Backdrop,
            backdropProps = {},
            className,
            children,
            container,
            disableAutoFocus = false,
            disableBackdropClick = false,
            disableFocusLock = false,
            disableEscapeKeyDown = false,
            disableRestoreFocus = false,
            hideBackdrop = false,
            keepMounted = false,
            targetHandleExited = hideBackdrop ? 'children' : 'backdrop',
            onClose,
            open,
            dataTestId,
        },
        ref,
    ) => {
        const [exited, setExited] = useState(!open);
        const restoreContainerStyles = useRef<null | (() => void)>(null);

        const shouldRender = keepMounted || open || !exited;

        const handleBackdropClick = useCallback(
            (event: MouseEvent<HTMLDivElement>) => {
                if (event.target !== event.currentTarget) {
                    return;
                }

                if (!disableBackdropClick && onClose) {
                    onClose(event, 'backdropClick');
                }
            },
            [disableBackdropClick, onClose],
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

                if (!disableEscapeKeyDown && onClose) {
                    onClose(event, 'escapeKeyDown');
                }
            },
            [disableEscapeKeyDown, onClose],
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

        const childProps = isValidElement(children)
            ? {
                  onExited: (node: HTMLElement) => {
                      if (targetHandleExited === 'children') {
                          setExited(true);
                      }

                      if (children.props.onExited) {
                          children.props.onExited(node);
                      }
                  },
              }
            : {};

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
                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                    <div
                        role='dialog'
                        className={cn(styles.component, className, {
                            [styles.hidden]: !open && exited,
                        })}
                        ref={ref}
                        onKeyDown={handleKeyDown}
                        tabIndex={-1}
                        data-test-id={dataTestId}
                    >
                        {hideBackdrop === false && (
                            <BackdropComponent
                                {...backdropProps}
                                open={open}
                                onExited={handleBackdropExited}
                                onClick={handleBackdropClick}
                            />
                        )}

                        {isValidElement(children) ? cloneElement(children, childProps) : children}
                    </div>
                </FocusLock>
            </Portal>
        );
    },
);
