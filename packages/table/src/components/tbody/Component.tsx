import React, { HTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

export type TBodyProps = HTMLAttributes<HTMLTableSectionElement> & {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const TBody: React.FC<TBodyProps> = ({ className, children, dataTestId, ...restProps }) => {
    return (
        <tbody className={cn(styles.component, className)} data-test-id={dataTestId} {...restProps}>
            {children}
        </tbody>
    );
};
