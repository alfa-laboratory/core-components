import React, { ReactNode } from 'react';
import cn from 'classnames';
import { Typography } from '@alfalab/core-components-typography';

import styles from './index.module.css';

export type ListHeaderProps = {
    /**
     * Заголовок
     */
    title: ReactNode;

    /**
     * Дополнительное описание
     */
    description?: ReactNode;

    /**
     * Наличие фоновой подложки
     */
    filled?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const ListHeader: React.FC<ListHeaderProps> = ({
    title,
    description,
    filled = true,
    className,
    dataTestId,
}) => {
    const componentProps = {
        className: cn(
            styles.component,
            {
                [styles.filled]: filled,
            },
            className,
        ),
        'data-test-id': dataTestId || null,
    };

    return (
        <div {...componentProps}>
            <Typography.Text view='secondary-large'>{title}</Typography.Text>
            {description && (
                <Typography.Text view='secondary-large' className={cn(styles.description)}>
                    {`, ${description}`}
                </Typography.Text>
            )}
        </div>
    );
};
