import React, { HTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './index.module.css';
import { TCell, TInternalCell, TCellProps } from '../tcell';

export type TRowProps = HTMLAttributes<HTMLTableRowElement> & {
    /**
     * Компоненты ячеек
     */
    children: Array<React.ReactElement<TCellProps, typeof TCell>>;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const TRow = ({ children, className, dataTestId, ...restProps }: TRowProps) => (
    <tr className={cn(styles.component, className)} data-test-id={dataTestId} {...restProps}>
        {React.Children.map(children, (child, index) => (
            <TInternalCell index={index}>{child}</TInternalCell>
        ))}
    </tr>
);
