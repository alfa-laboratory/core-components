import React, { forwardRef, ReactNode, useMemo } from 'react';
import cn from 'classnames';

import { BaseModal, BaseModalProps } from '@alfalab/core-components-modal';

import styles from './index.module.css';

export const ANIMATION_DURATION = 600;

export type DrawerProps = Omit<
    BaseModalProps,
    | 'onHeaderHighlight'
    | 'onFooterHighlight'
    | 'highlightHeader'
    | 'highlightFooter'
    | 'header'
    | 'hideBackdrop'
    | 'backdropProps'
    | 'fullscreen'
    | 'container'
    | 'targetHandleExited'
    | 'Transition'
    | 'transitionProps'
> & {
    /**
     * Шапка
     */
    header?: ReactNode;

    /**
     * Футер
     */
    footer?: ReactNode;
};

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
    ({ open, className, children, header, footer, contentClassName, ...restProps }, ref) => {
        const transitionProps = useMemo(
            () => ({
                classNames: styles,
                timeout: ANIMATION_DURATION,
            }),
            [],
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
            }),
            [],
        );

        return (
            <BaseModal
                {...restProps}
                ref={ref}
                open={open}
                className={cn(styles.component, className)}
                contentClassName={cn(contentClassName, styles.content)}
                fullscreen={true}
                targetHandleExited='children'
                transitionProps={transitionProps}
                backdropProps={backdropProps}
                header={header}
                footer={footer}
            >
                {children}
            </BaseModal>
        );
    },
);
