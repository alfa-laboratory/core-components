import React, { forwardRef, ReactNode } from 'react';
import cn from 'classnames';

import { BaseModal, BaseModalProps, Header, Footer } from './components/index';

import styles from './index.module.css';

export type ModalProps = Omit<
    BaseModalProps,
    'onHeaderHighlight' | 'onFooterHighlight' | 'header'
> & {
    /**
     * Дополнительный класс для хэдера
     */
    headerClassName?: string;

    /**
     * Дополнительный класс для футера
     */
    footerClassName?: string;

    /**
     * Ширина модального окна
     * @default "m"
     */
    size?: 's' | 'm' | 'l';

    /**
     * Заголовок модального окна
     */
    headerContent?: ReactNode;

    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            size,
            hasCloser = true,
            className,
            contentClassName,
            headerClassName,
            footerClassName,
            headerContent,
            footer,
            stickyHeader,
            stickyFooter,
            flexContent,
            fullscreen,
            transitionProps,
            ...restProps
        },
        ref,
    ) => {
        return (
            <BaseModal
                {...restProps}
                ref={ref}
                fullscreen={fullscreen}
                className={cn(styles.component, size && styles[size], className, {
                    [styles.fullscreen]: fullscreen,
                })}
                contentClassName={cn(
                    styles.content,
                    size && styles[`content-${size}`],
                    contentClassName,
                )}
                transitionProps={{
                    classNames: styles,
                    ...transitionProps,
                }}
                stickyHeader={stickyHeader}
                stickyFooter={stickyFooter}
                flexContent={flexContent}
                header={
                    (headerContent || hasCloser) && (
                        <Header className={headerClassName} size={size} hasCloser={hasCloser}>
                            {headerContent}
                        </Header>
                    )
                }
                footer={
                    footer && (
                        <Footer className={footerClassName} size={size}>
                            {footer}
                        </Footer>
                    )
                }
            />
        );
    },
);
