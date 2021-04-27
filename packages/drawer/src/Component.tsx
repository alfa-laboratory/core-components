import React, { forwardRef, useMemo } from 'react';
import cn from 'classnames';

import { BaseModal, BaseModalProps, BaseModalContext } from '@alfalab/core-components-base-modal';

import styles from './index.module.css';

export const ANIMATION_DURATION = 600;

export type DrawerProps = Omit<BaseModalProps, 'container'>;

export const DrawerContext = BaseModalContext;

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
                    enterDone: styles.backdropEnterDone,
                    appear: styles.backdropAppear,
                    appearActive: styles.backdropAppearActive,
                    appearDone: styles.backdropAppearDone,
                    exit: styles.backdropExit,
                    exitActive: styles.backdropExitActive,
                    exitDone: styles.backdropExitDone,
                },
                timeout: ANIMATION_DURATION,
                ...restProps.backdropProps,
            }),
            [restProps.backdropProps],
        );

        return (
            <BaseModal
                {...restProps}
                scrollHandler='content'
                ref={ref}
                open={open}
                className={cn(styles.component, className)}
                transitionProps={transitionProps}
                backdropProps={backdropProps}
            >
                {children}
            </BaseModal>
        );
    },
);
