import React from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type BadgeProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Размер компонента
     */
    size?: 's' | 'm' | 'l';

    /**
     *  Вид компонента
     */
    view: 'icon' | 'count';

    /**
     * Контент компонента
     */
    content?: React.ReactElement | number;

    /**
     * Цветовое оформление иконки
     */
    iconColor?: 'positive' | 'attention' | 'negative' | 'tertiary' | 'primary';

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Badge = ({
    className,
    size = 'm',
    view,
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
                },
                className,
            )}
            data-test-id={dataTestId}
        >
            {componentContent}
        </div>
    );
};
