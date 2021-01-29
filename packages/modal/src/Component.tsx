import React, { useCallback, useState, forwardRef, useMemo, ReactNode } from 'react';
import cn from 'classnames';
import { Typography } from '@alfalab/core-components-typography';
import { BaseModal, BaseModalProps, Header, Footer } from './components';

import styles from './index.module.css';

export type ModalProps = Omit<
    BaseModalProps,
    'onHeaderHighlight' | 'onFooterHighlight' | 'header'
> & {
    /**
     * Ширина модального окна
     * @default "m"
     */
    size?: 's' | 'm' | 'l';

    /**
     * Заголовок модального окна
     */
    headerTitle?: ReactNode;

    /**
     * Отключает подсветку хедера
     */
    disableHeaderHightlight?: boolean;

    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            size = 'm',
            hasCloser = true,
            disableHeaderHightlight = false,
            className,
            contentClassName,
            headerClassName,
            footerClassName,
            headerTitle,
            footer,
            ...restProps
        },
        ref,
    ) => {
        const [headerHighlighted, setHeaderHighlighted] = useState(false);
        const [footerHightlighted, setFooterHighlighted] = useState(false);

        const handleHeaderHightlight = useCallback(highlighted => {
            setHeaderHighlighted(highlighted);
        }, []);

        const handleFooterHightlight = useCallback(highlighted => {
            setFooterHighlighted(highlighted);
        }, []);

        const transitionProps = useMemo(
            () => ({
                classNames: styles,
            }),
            [],
        );

        return (
            <BaseModal
                {...restProps}
                className={cn(styles.component, size && styles[size], className)}
                contentClassName={cn(
                    styles.content,
                    size && styles[`content-${size}`],
                    contentClassName,
                )}
                transitionProps={transitionProps}
                ref={ref}
                onHeaderHighlight={handleHeaderHightlight}
                onFooterHighlight={handleFooterHightlight}
                header={
                    (headerTitle || hasCloser) && (
                        <Header
                            size={size}
                            className={headerClassName}
                            highlighted={headerHighlighted && !disableHeaderHightlight}
                            hasCloser={hasCloser}
                        >
                            {headerTitle && (
                                <Typography.Title view='small' tag='div'>
                                    {headerTitle}
                                </Typography.Title>
                            )}
                        </Header>
                    )
                }
                footer={
                    footer && (
                        <Footer
                            className={footerClassName}
                            highlighted={footerHightlighted}
                            size={size}
                        >
                            {footer}
                        </Footer>
                    )
                }
            />
        );
    },
);
