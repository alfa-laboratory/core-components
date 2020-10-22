import React, { useMemo } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type BadgeProps = {
    /**
     * Размер компонента
     */
    size?: 's' | 'm';

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
    iconColor?: 'positive' | 'attention' | 'negative' | 'hold' | 'repeat';

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ size = 'm', view, content, iconColor, dataTestId }, ref) => {
        const isCountView = view === 'count';
        const isHidden = isCountView && typeof content === 'number' && content <= 0;

        const componentContent = useMemo(() => {
            if (content && isCountView) {
                if (content >= 100) {
                    return '99+';
                }
            }

            return content;
        }, [content, isCountView]);

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
                )}
                data-test-id={dataTestId}
                ref={ref}
            >
                {componentContent}
            </div>
        );
    },
);

/**
 * Для отображения в сторибуке
 */
Badge.defaultProps = {
    size: 'm',
};
