import React, { forwardRef, ReactNode, RefCallback, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
import { useSwipeable } from 'react-swipeable';

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
     * Минимальная скорость смахивания, при которой шторка закроется
     * https://github.com/FormidableLabs/react-swipeable#swipe-event-data
     * @default 0.5
     */
    swipeCloseVelocity?: number;

    /**
     * Обработчик закрытия
     */
    onClose: () => void;
};

export const SWIPE_CLOSE_VELOCITY = 0.3;

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
            swipeCloseVelocity = SWIPE_CLOSE_VELOCITY,
            onClose,
        },
        ref,
    ) => {
        const [exited, setExited] = useState(!open);

        const { ref: swipeableRef } = useSwipeable({
            onSwiped: ({ dir, velocity }) => {
                const shouldClose = dir === 'Down' && velocity > swipeCloseVelocity;

                if (shouldClose) {
                    onClose();
                }
            },
            delta: 100,
        }) as { ref: RefCallback<Document> };

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

        useEffect(() => {
            swipeableRef(document);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

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

BottomSheet.defaultProps = {
    swipeCloseVelocity: SWIPE_CLOSE_VELOCITY,
};
