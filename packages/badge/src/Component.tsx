import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type BadgeProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     *  Вид компонента
     */
    view: 'icon' | 'count';

    /**
     * Размер компонента (только для view=count)
     */
    size?: 's' | 'm' | 'l';

    /**
     *  Видимость обводки вокруг иконки (только для view=icon)
     */
    visibleIconOutline?: boolean;

    /**
     * Контент компонента
     */
    content?: React.ReactElement | number;

    /**
     * Цветовое оформление иконки
     */
    iconColor?: 'positive' | 'attention' | 'negative' | 'tertiary' | 'secondary' | 'primary';

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Badge = ({
    className,
    size = 'm',
    view,
    visibleIconOutline = false,
    content,
    iconColor,
    dataTestId,
}: BadgeProps) => {
    const isCountView = view === 'count';

    const isHidden = isCountView && typeof content === 'number' && content <= 0;
    const componentContent = isCountView && content && content >= 100 ? '99+' : content;

    return (
        <div
            className={cn(
                styles.component,
                styles[size],
                styles[view],
                iconColor && styles[iconColor],
                {
                    [styles.isHidden]: isHidden,
                    [styles.dot]: !content,
                    [styles.outline]: visibleIconOutline,
                },
                className,
            )}
            data-test-id={dataTestId}
        >
            {componentContent}
        </div>
    );
};
