import React, { HTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type THeadProps = HTMLAttributes<HTMLTableSectionElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дополнительный класс для tr
     */
    rowClassName?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const THead: React.FC<THeadProps> = ({
    className,
    rowClassName,
    children,
    dataTestId,
    ...restProps
}) => {
    return (
        <thead className={cn(styles.component, className)} data-test-id={dataTestId} {...restProps}>
            <tr className={cn(styles.row, rowClassName)}>{children}</tr>
        </thead>
    );
};
