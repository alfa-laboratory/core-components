import React, {
    forwardRef,
    MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    TouchEventHandler,
} from 'react';
import mergeRefs from 'react-merge-refs';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import { useClickOutside, usePrevious } from '@alfalab/hooks';
import { ToastPlate, ToastPlateProps } from '@alfalab/core-components-toast-plate';
import { Popover, PopoverProps } from '@alfalab/core-components-popover';
import { Portal } from '@alfalab/core-components-portal';

import styles from './index.module.css';

export type ToastProps = ToastPlateProps &
    Pick<
        PopoverProps,
        'position' | 'offset' | 'open' | 'getPortalContainer' | 'preventFlip' | 'transition'
    > & {
        /**
         * Элемент, относительного которого появляется тост.
         * Если не передавать, тост будет позиционирован снизу экрана, по центру (position: fixed).
         */
        anchorElement?: HTMLElement;

        /**
         * Через сколько исчезнет компонент (ms).
         */
        autoCloseDelay?: number;

        /**
         * Обработчик закрытия компонента.
         */
        onClose: () => void;

        /**
         * Отступ снизу (при fixed-позиционировании).
         */
        bottomOffset?: number;

        /**
         * Будет позиционирован снизу по центру (при fixed-позиционировании)
         */
        centeredPosition?: boolean;
    };

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
    (
        {
            anchorElement,
            position,
            offset,
            open,
            autoCloseDelay = 3000,
            className,
            bottomOffset,
            style = {},
            block,
            onMouseEnter,
            onMouseLeave,
            onTouchStart,
            onClose,
            getPortalContainer,
            centeredPosition = true,
            ...restProps
        },
        ref,
    ) => {
        const plateRef = useRef<HTMLDivElement>(null);
        const timerId = useRef(0);
        const prevOpen = usePrevious(open);

        const startTimer = useCallback(() => {
            clearTimeout(timerId.current);

            timerId.current = window.setTimeout(onClose, autoCloseDelay);
        }, [autoCloseDelay, onClose]);

        const stopTimer = useCallback(() => {
            clearTimeout(timerId.current);
        }, []);

        const handleMouseEnter = useCallback<MouseEventHandler<HTMLDivElement>>(
            event => {
                stopTimer();

                if (onMouseEnter) {
                    onMouseEnter(event);
                }
            },
            [onMouseEnter, stopTimer],
        );

        const handleMouseLeave = useCallback<MouseEventHandler<HTMLDivElement>>(
            event => {
                startTimer();

                if (onMouseLeave) {
                    onMouseLeave(event);
                }
            },
            [onMouseLeave, startTimer],
        );

        const handleTouchStart = useCallback<TouchEventHandler<HTMLDivElement>>(
            event => {
                stopTimer();

                if (onTouchStart) {
                    onTouchStart(event);
                }
            },
            [onTouchStart, stopTimer],
        );

        const handleClickOutside = useCallback(() => {
            onClose();
            stopTimer();
        }, [onClose, stopTimer]);

        useClickOutside(plateRef, handleClickOutside);

        useEffect(() => {
            if (open !== prevOpen && open) {
                startTimer();
            }

            return () => {
                stopTimer();
            };
        }, [open, prevOpen, startTimer, stopTimer]);

        const callbacks = {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onTouchStart: handleTouchStart,
        };

        if (anchorElement) {
            return (
                <Popover
                    open={open}
                    anchorElement={anchorElement}
                    position={position}
                    offset={offset}
                    popperClassName={cn(styles.popover, { [styles.block]: block })}
                    transition={{ timeout: 150 }}
                    getPortalContainer={getPortalContainer}
                >
                    <ToastPlate
                        {...restProps}
                        block={block}
                        style={style}
                        ref={mergeRefs([ref, plateRef])}
                        onClose={onClose}
                        {...callbacks}
                    />
                </Popover>
            );
        }

        return (
            <Portal getPortalContainer={getPortalContainer}>
                <CSSTransition
                    unmountOnExit={true}
                    in={open}
                    timeout={150}
                    classNames={{
                        enter: styles.enter,
                        enterActive: styles.enterActive,
                        exit: styles.exit,
                        exitActive: styles.exitActive,
                    }}
                >
                    <ToastPlate
                        {...restProps}
                        block={block}
                        ref={mergeRefs([ref, plateRef])}
                        onClose={onClose}
                        className={cn(
                            styles.fixed,
                            { [styles.centered]: centeredPosition },
                            className,
                        )}
                        style={{
                            ...style,
                            bottom: bottomOffset && `${bottomOffset}px`,
                        }}
                        {...callbacks}
                    />
                </CSSTransition>
            </Portal>
        );
    },
);
