import React, { forwardRef, useMemo } from 'react';
import cn from 'classnames';

import { Modal, ModalProps, ModalContext } from '@alfalab/core-components-modal';

import styles from './index.module.css';

export const ANIMATION_DURATION = 600;

export type DrawerProps = Omit<
    ModalProps,
    'hideBackdrop' | 'fullscreen' | 'container' | 'targetHandleExited'
>;

export const DrawerContext = ModalContext;

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
    ({ open, className, children, ...restProps }, ref) => {
        const transitionProps = useMemo(
            () => ({
                classNames: styles,
                timeout: ANIMATION_DURATION,
                ...restProps.transitionProps,
            }),
            [restProps.transitionProps],
        );

        const backdropProps = useMemo(
            () => ({
                classNames: {
                    enter: styles.backdropEnter,
                    enterActive: styles.backdropEnterActive,
                    appear: styles.backdropAppear,
                    appearActive: styles.backdropAppearActive,
                    exit: styles.backdropExit,
                    exitActive: styles.backdropExitActive,
                },
                timeout: ANIMATION_DURATION,
                ...restProps.backdropProps,
            }),
            [restProps.backdropProps],
        );

        return (
            <Modal
                {...restProps}
                ref={ref}
                open={open}
                className={cn(styles.component, className)}
                fullscreen={true}
                targetHandleExited='children'
                transitionProps={transitionProps}
                backdropProps={backdropProps}
            >
                {children}
            </Modal>
        );
    },
);
