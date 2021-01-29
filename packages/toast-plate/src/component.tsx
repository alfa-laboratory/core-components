import React, { forwardRef, HTMLAttributes, ReactNode, MouseEvent } from 'react';
import cn from 'classnames';

import { Button } from '@alfalab/core-components-button';
import { Badge } from '@alfalab/core-components-badge';
import { CheckmarkCircleMIcon } from '@alfalab/icons-glyph/CheckmarkCircleMIcon';
import { CrossCircleMIcon } from '@alfalab/icons-glyph/CrossCircleMIcon';
import { AlertCircleMIcon } from '@alfalab/icons-glyph/AlertCircleMIcon';
import { CrossMIcon } from '@alfalab/icons-glyph/CrossMIcon';

import styles from './index.module.css';

export type BadgeIcons = {
    negative: JSX.Element;
    positive: JSX.Element;
    attention: JSX.Element;
};

export type ToastPlateProps = HTMLAttributes<HTMLDivElement> & {
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
     * Вид бэйджа
     */
    badge?: 'negative' | 'positive' | 'attention';

    /**
     * Слот слева, заменяет стандартную иконку
     */
    leftAddons?: ReactNode;

    /**
     * Кнопка действия
     */
    actionButton?: ReactNode;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Управляет отображением кнопки закрытия уведомления
     */
    hasCloser?: boolean;

    /**
     * Растягивает компонент на ширину контейнера
     */
    block?: boolean;

    /**
     * Обработчик клика по крестику
     */
    onClose?: (event?: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Функция, с помощью которой можно переопределить иконки в Badge
     */
    getBadgeIcons?: (icons: BadgeIcons) => BadgeIcons;
};

const iconDefaultComponents = {
    negative: <CrossCircleMIcon className={styles.badgeIcon} />,
    positive: <CheckmarkCircleMIcon className={styles.badgeIcon} />,
    attention: <AlertCircleMIcon className={styles.badgeIcon} />,
};

export const ToastPlate = forwardRef<HTMLDivElement, ToastPlateProps>(
    (
        {
            dataTestId,
            className,
            hasCloser,
            leftAddons,
            badge,
            title,
            children,
            actionButton,
            block,
            onClose,
            getBadgeIcons,
            ...restProps
        },
        ref,
    ) => {
        const needRenderCloser = hasCloser && Boolean(onClose);
        const needRenderActionsSection = Boolean(actionButton);

        const iconComponents = getBadgeIcons
            ? getBadgeIcons(iconDefaultComponents)
            : iconDefaultComponents;

        return (
            <div
                className={cn(
                    styles.component,
                    { [styles.block]: block, [styles.hasCloser]: needRenderCloser },
                    className,
                )}
                ref={ref}
                data-test-id={dataTestId}
                {...restProps}
            >
                <div className={styles.mainContentWrap}>
                    <div
                        className={cn(styles.mainSection, {
                            [styles.hasRightSection]: needRenderActionsSection || needRenderCloser,
                        })}
                    >
                        {(leftAddons || badge) && (
                            <div className={styles.leftAddons}>
                                {leftAddons ||
                                    (badge && (
                                        <Badge
                                            view='icon'
                                            content={iconComponents[badge]}
                                            iconColor={badge}
                                            className={styles.badge}
                                            dataTestId='badge'
                                        />
                                    ))}
                            </div>
                        )}

                        <div>
                            {title && <div className={styles.title}>{title}</div>}
                            {children && <div className={styles.children}>{children}</div>}
                        </div>
                    </div>

                    {needRenderActionsSection && (
                        <div
                            className={cn(styles.actionsSection, {
                                [styles.hasCloser]: needRenderCloser,
                            })}
                        >
                            {actionButton || null}
                        </div>
                    )}

                    {needRenderCloser && (
                        <Button
                            className={cn(styles.closeButton)}
                            view='ghost'
                            onClick={onClose}
                            aria-label='закрыть'
                            leftAddons={<CrossMIcon />}
                        />
                    )}
                </div>
            </div>
        );
    },
);
