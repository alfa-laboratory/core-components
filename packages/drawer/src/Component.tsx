import React, { forwardRef, useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';
import { TransitionProps } from 'react-transition-group/Transition';
import cn from 'classnames';

import { BaseModal, BaseModalProps, BaseModalContext } from '@alfalab/core-components-base-modal';

import styles from './index.module.css';

export const ANIMATION_DURATION = 600;

export type DrawerProps = Omit<BaseModalProps, 'container'> & {
    /**
     * Пропсы для анимации контента (CSSTransition)
     */
    contentTransitionProps?: Partial<TransitionProps>;
};

export const DrawerContext = BaseModalContext;

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
    ({ open, className, children, contentTransitionProps, ...restProps }, ref) => {
        const transitionProps = useMemo(
            () => ({
                classNames: {
                    enter: styles.enter,
                    appear: styles.enter,
                    enterActive: styles.enterActive,
                    appearActive: styles.enterActive,
                    exit: styles.exit,
                    exitActive: styles.exitActive,
                },
                timeout: ANIMATION_DURATION,
                ...restProps.transitionProps,
            }),
            [restProps.transitionProps],
        );

        const backdropProps = useMemo(
            () => ({
                classNames: {
                    enter: styles.backdropEnter,
                    appear: styles.backdropEnter,
                    enterActive: styles.backdropEnterActive,
                    appearActive: styles.backdropEnterActive,
                    enterDone: styles.backdropEnterDone,
                    appearDone: styles.backdropEnterDone,
                    exit: styles.backdropExit,
                    exitActive: styles.backdropExitActive,
                    exitDone: styles.backdropExitDone,
                },
                timeout: ANIMATION_DURATION,
                ...restProps.backdropProps,
            }),
            [restProps.backdropProps],
        );

        const contentProps = useMemo(
            () => ({
                classNames: {
                    enter: styles.contentEnter,
                    appear: styles.contentEnter,
                    enterActive: styles.contentEnterActive,
                    appearActive: styles.contentEnterActive,
                    exit: styles.contentExit,
                    exitActive: styles.contentExitActive,
                },
                timeout: ANIMATION_DURATION,
                ...contentTransitionProps,
            }),
            [contentTransitionProps],
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
                <CSSTransition appear={true} {...contentProps} in={open}>
                    <div className={styles.content}>{children}</div>
                </CSSTransition>
            </BaseModal>
        );
    },
);
