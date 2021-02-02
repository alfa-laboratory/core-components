import React, { forwardRef, ReactNode, useCallback, useMemo, useState } from 'react';
import cn from 'classnames';

import { BaseModal, BaseModalProps, Footer, Header } from '@alfalab/core-components-modal';

import styles from './index.module.css';

export type DrawerProps = Omit<
    BaseModalProps,
    | 'onHeaderHighlight'
    | 'onFooterHighlight'
    | 'highlightHeader'
    | 'highlightFooter'
    | 'header'
    | 'backdrop'
    | 'fullscreen'
    | 'container'
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
     * Заголовок модального окна
     */
    headerContent?: ReactNode;

    /**
     * Управление наличием закрывающего крестика
     * @default false
     */
    hasCloser?: boolean;
};

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
    (
        {
            open,
            className,
            children,
            headerContent,
            footer,
            hasCloser,
            headerClassName,
            footerClassName,
            contentClassName,
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
                timeout: 600,
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
                timeout: 600,
                ...restProps.backdropProps,
            }),
            [restProps.backdropProps],
        );

        return (
            <BaseModal
                {...restProps}
                ref={ref}
                open={open}
                className={cn(styles.component, className)}
                contentClassName={cn(contentClassName, styles.content)}
                highlightFooter={true}
                highlightHeader={true}
                fullscreen={true}
                targetHandleExited='children'
                transitionProps={transitionProps}
                backdropProps={backdropProps}
                onHeaderHighlight={handleHeaderHightlight}
                onFooterHighlight={handleFooterHightlight}
                header={
                    <Header
                        className={cn(headerClassName, styles.header)}
                        highlighted={headerHighlighted}
                        hasCloser={hasCloser}
                    >
                        {headerContent}
                    </Header>
                }
                footer={
                    footer && (
                        <Footer
                            className={cn(footerClassName, styles.footer)}
                            highlighted={footerHightlighted}
                        >
                            {footer}
                        </Footer>
                    )
                }
            >
                {children}
            </BaseModal>
        );
    },
);
