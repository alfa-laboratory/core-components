import React, { useCallback, useState, forwardRef, useMemo, ReactNode } from 'react';
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
     * Отключает подсветку хедера
     */
    disableHeaderHightlight?: boolean;

    /**
     * Заставляет хэдер прилипать к верхнему краю экрана при прокрутке
     */
    stickyHeader?: boolean;

    /**
     * Заставляет футер прилипать к нижнему краю экрана при прокрутке
     */
    stickyFooter?: boolean;

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
            disableHeaderHightlight = false,
            className,
            contentClassName,
            headerClassName,
            footerClassName,
            headerContent,
            footer,
            stickyHeader,
            stickyFooter,
            fullscreen,
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
                ...restProps.transitionProps,
            }),
            [restProps.transitionProps],
        );

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
                transitionProps={transitionProps}
                onHeaderHighlight={handleHeaderHightlight}
                onFooterHighlight={handleFooterHightlight}
                highlightHeader={stickyHeader || fullscreen}
                highlightFooter={stickyFooter}
                header={
                    <Header
                        size={size}
                        className={cn(headerClassName, {
                            [styles.stickyHeader]: stickyHeader,
                        })}
                        highlighted={headerHighlighted && !disableHeaderHightlight}
                        hasCloser={hasCloser}
                    >
                        {headerContent}
                    </Header>
                }
                footer={
                    footer && (
                        <Footer
                            className={cn(footerClassName, {
                                [styles.stickyFooter]: stickyFooter,
                            })}
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
