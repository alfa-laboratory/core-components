import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import mergeRefs from 'react-merge-refs';
import { useClickOutside, usePrevious } from '@alfalab/hooks';
import { ToastPlate, ToastPlateProps } from '@alfalab/core-components-toast-plate';
import { Popover, PopoverProps } from '@alfalab/core-components-popover';

import styles from './index.module.css';

export type ToastProps = ToastPlateProps &
    Pick<PopoverProps, 'anchorElement' | 'position' | 'offset' | 'open'> & {
        /**
         * Через сколько исчезнет компонент (ms)
         */
        autoCloseDelay?: number;

        /**
         * Обработчик закрытия компонента
         */
        onClose: () => void;
    };

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
    (
        { anchorElement, position, offset, open, onClose, autoCloseDelay = 3000, ...restProps },
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
    },
);
