import React, { useMemo, TableHTMLAttributes } from 'react';
import cn from 'classnames';

import { ColumnConfiguration, TableContext } from '../table-context';
import { findAllHeadCellsProps } from './utils';

import styles from './index.module.css';

export type TableProps = TableHTMLAttributes<HTMLTableElement> & {
    /**
     * Компактный вид
     */
    compactView?: boolean;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Дочерние компоненты
     */
    children: React.ReactElement[];

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Table: React.FC<TableProps> = ({
    className,
    children,
    compactView = false,
    dataTestId,
    ...restProps
}) => {
    const columnsConfiguration: ColumnConfiguration[] = useMemo(
        () =>
            findAllHeadCellsProps(children).map((columnProps, index) => ({
                width: columnProps.width,
                textAlign: columnProps.textAlign,
                hidden: columnProps.hidden,
                index,
            })),
        [children],
    );

    return (
        <TableContext.Provider value={{ columnsConfiguration, compactView }}>
            <table
                className={cn(styles.component, className)}
                data-test-id={dataTestId}
                {...restProps}
            >
                {children}
            </table>
        </TableContext.Provider>
    );
};
