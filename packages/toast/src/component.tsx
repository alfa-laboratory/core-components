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

const CSS_TRANSITION_CLASS_NAMES = {
    enter: styles.enter,
    enterActive: styles.enterActive,
    exit: styles.exit,
    exitActive: styles.exitActive,
};

export type ToastProps = ToastPlateProps &
    Pick<
        PopoverProps,
        'position' | 'offset' | 'open' | 'getPortalContainer' | 'preventFlip' | 'transition'
    > & {
        /**
         * Элемент, относительного которого появляется тост.
         * Если не передавать, тост будет позиционирован снизу экрана (position: fixed).
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
        }, [open, prevOpen, startTimer, stopTimer]);

        const props = {
            block,
            onClose,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onTouchStart: handleTouchStart,
            ref: mergeRefs([ref, plateRef]),
        };

        if (anchorElement) {
            return (
                <Popover
                    open={open}
                    anchorElement={anchorElement}
                    position={position}
                    offset={offset}
                    popperClassName={styles.popoverInner}
                    className={cn(styles.popover, { [styles.block]: block })}
                    transition={{ timeout: 150 }}
                    getPortalContainer={getPortalContainer}
                >
                    <ToastPlate {...restProps} style={style} className={className} {...props} />
                </Popover>
            );
        }

        return (
            <Portal getPortalContainer={getPortalContainer}>
                <CSSTransition
                    unmountOnExit={true}
                    in={open}
                    timeout={150}
                    classNames={CSS_TRANSITION_CLASS_NAMES}
                >
                    <ToastPlate
                        {...restProps}
                        className={cn(styles.fixed, styles.toastPlate, className)}
                        style={{
                            ...style,
                            bottom: bottomOffset && `${bottomOffset}px`,
                        }}
                        {...props}
                    />
                </CSSTransition>
            </Portal>
        );
    },
);
