import React, { forwardRef, HTMLAttributes, ReactNode, MouseEvent } from 'react';
import cn from 'classnames';

import { CloseSWhiteIcon } from '@alfalab/icons-classic/CloseSWhiteIcon';
import { CheckmarkMIcon } from '@alfalab/icons-glyph/CheckmarkMIcon';
import { CrossMIcon } from '@alfalab/icons-glyph/CrossMIcon';
import { ExclamationMIcon } from '@alfalab/icons-glyph/ExclamationMIcon';
import { Button } from '@alfalab/core-components-button';

import styles from './index.module.css';

export type ToastProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дочерние элементы
     */
    children?: ReactNode;

    /**
     * Заголовок компонента
     */
    title?: ReactNode;

    /**
     * Вид иконки
     */
    icon?: 'negative' | 'positive' | 'warning';

    /**
     * Слот слева, заменяет стандартную иконку
     */
    leftAddons?: ReactNode;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Управляет отображением кнопки закрытия уведомления
     */
    hasCloser?: boolean;

    /**
     * Обработчик клика по крестику
     */
    onClose?: (event?: MouseEvent<HTMLButtonElement>) => void;
};

const iconComponent = {
    negative: <CrossMIcon className={styles.iconSvg} />,
    positive: <CheckmarkMIcon className={styles.iconSvg} />,
    warning: <ExclamationMIcon className={styles.iconSvg} />,
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
    (
        {
            dataTestId,
            className,
            hasCloser,
            leftAddons,
            icon,
            title,
            children,
            onClose,
            ...restProps
        },
        ref,
    ) => {
        return (
            <div
                className={cn(
                    styles.component,
                    {
                        [styles.hasCloser]: hasCloser,
                    },
                    className,
                )}
                ref={ref}
                data-test-id={dataTestId}
                {...restProps}
            >
                {(leftAddons || icon) && (
                    <div className={styles.leftAddons}>
                        {leftAddons ||
                            (icon && (
                                <div className={cn(styles.icon, styles[icon])}>
                                    {iconComponent[icon]}
                                </div>
                            ))}
                    </div>
                )}
                <div className={styles.contentContainer}>
                    {title && <div className={styles.title}>{title}</div>}
                    {children && <div className={styles.content}>{children}</div>}
                </div>
                {hasCloser && onClose && (
                    <Button
                        className={styles.closer}
                        view='ghost'
                        onClick={onClose}
                        aria-label='закрыть'
                    >
                        <CloseSWhiteIcon />
                    </Button>
                )}
            </div>
        );
    },
);
