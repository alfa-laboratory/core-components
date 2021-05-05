import React, { forwardRef, ReactNode, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

import { Stack, stackingOrder } from '@alfalab/core-components-stack';
import { Portal } from '@alfalab/core-components-portal';
import { Backdrop } from '@alfalab/core-components-backdrop';
import { Typography } from '@alfalab/core-components-typography';

import styles from './index.module.css';

const DEFAULT_TRANSITION: CSSTransitionProps<HTMLDivElement> = {
    timeout: 200,
};

export type BottomSheetProps = {
    /**
     * Управление видимостью
     */
    open: boolean;

    /**
     * Заголовок
     */
    title?: ReactNode;

    /**
     * Кнопка действия (обычно, это кнопка закрытия)
     */
    actionButton?: ReactNode;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс
     */
    contentClassName?: string;

    /**
     * CSSTransitionProps, прокидываются в компонент CSSTransitionProps.
     */
    transition?: CSSTransitionProps;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * z-index компонента
     */
    zIndex?: number;

    /**
     * Обработчик закрытия
     */
    onClose: () => void;
};

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
    (
        {
            open,
            title,
            actionButton,
            contentClassName,
            className,
            children,
            zIndex = stackingOrder.MODAL,
            transition = DEFAULT_TRANSITION,
            dataTestId,
            onClose,
        },
        ref,
    ) => {
        const [exited, setExited] = useState(!open);

        const handleBackdropClick = useCallback(() => {
            onClose();
        }, [onClose]);

        const handleExited = useCallback(
            node => {
                setExited(true);

                if (transition.onExited) {
                    transition.onExited(node);
                }
            },
            [transition],
        );

        useEffect(() => {
            if (open) setExited(false);
        }, [open]);

        const shouldRender = open || !exited;

        if (!shouldRender) return null;

        return (
            <Stack value={zIndex}>
                {computedZIndex => (
                    <Portal>
                        <div
                            role='dialog'
                            ref={ref}
                            style={{ zIndex: computedZIndex }}
                            className={styles.wrapper}
                            tabIndex={-1}
                            data-test-id={dataTestId}
                        >
                            <Backdrop open={open} onClick={handleBackdropClick} />

                            <CSSTransition
                                appear={true}
                                classNames={styles}
                                {...transition}
                                in={open}
                                onExited={handleExited}
                            >
                                <div
                                    className={cn(styles.component, className)}
                                    style={{ transitionDuration: `${transition.timeout}ms` }}
                                >
                                    {title && (
                                        <Typography.Title
                                            view='small'
                                            font='system'
                                            tag='h2'
                                            className={styles.title}
                                        >
                                            {title}
                                        </Typography.Title>
                                    )}

                                    <div className={styles.marker} />

                                    <div className={cn(styles.content, contentClassName)}>
                                        {children}
                                    </div>

                                    {actionButton && (
                                        <div className={styles.actionButtonWrapper}>
                                            {actionButton}
                                        </div>
                                    )}
                                </div>
                            </CSSTransition>
                        </div>
                    </Portal>
                )}
            </Stack>
        );
    },
);
