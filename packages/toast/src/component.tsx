import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import mergeRefs from 'react-merge-refs';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import { useClickOutside, usePrevious } from '@alfalab/hooks';
import { ToastPlate, ToastPlateProps } from '@alfalab/core-components-toast-plate';
import { Popover, PopoverProps } from '@alfalab/core-components-popover';
import { Portal } from '@alfalab/core-components-portal';

import styles from './index.module.css';

export type ToastProps = ToastPlateProps &
    Pick<PopoverProps, 'position' | 'offset' | 'open' | 'getPortalContainer'> & {
        /**
         * Элемент, относительного которого появляется тост
         */
        anchorElement?: HTMLElement;

        /**
         * Через сколько исчезнет компонент (ms)
         */
        autoCloseDelay?: number;

        /**
         * Обработчик закрытия компонента
         */
        onClose?: () => void;

        /**
         * Отступ снизу
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
            onClose,
            getPortalContainer,
            ...restProps
        },
        ref,
    ) => {
        const plateRef = useRef<HTMLDivElement>(null);
        const timerId = useRef(0);
        const prevOpen = usePrevious(open);

        const handleClickOutside = useCallback(() => {
            clearTimeout(timerId.current);
            onClose();
        }, [onClose]);

        useClickOutside(plateRef, handleClickOutside);

        useEffect(() => {
            if (open !== prevOpen && open) {
                timerId.current = window.setTimeout(onClose, autoCloseDelay);
            }

            return () => {
                clearTimeout(timerId.current);
            };
        }, [autoCloseDelay, open, prevOpen, onClose]);

        if (anchorElement) {
            return (
                <Popover
                    open={open}
                    anchorElement={anchorElement}
                    position={position}
                    offset={offset}
                    popperClassName={styles.popover}
                    transition={{ timeout: 150 }}
                >
                    <ToastPlate {...restProps} ref={mergeRefs([ref, plateRef])} onClose={onClose} />
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
                        ref={mergeRefs([ref, plateRef])}
                        onClose={onClose}
                        className={cn(styles.fixed, className)}
                        style={{
                            ...style,
                            bottom: bottomOffset && `${bottomOffset}px`,
                        }}
                    />
                </CSSTransition>
            </Portal>
        );
    },
);
