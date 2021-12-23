import React, { useMemo, TableHTMLAttributes, ReactNode, useRef, forwardRef } from 'react';
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
     * Оборачивает таблицу в стилизованный контейнер
     */
    wrapper?: boolean;

    /**
     * Слот для пагинации
     */
    pagination?: ReactNode;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Table = forwardRef<HTMLTableElement, TableProps>(
    (
        {
            className,
            children,
            compactView = false,
            wrapper = true,
            pagination,
            dataTestId,
            ...restProps
        },
        ref,
    ) => {
        const wrapperRef = useRef<HTMLDivElement>(null);

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
            <TableContext.Provider value={{ columnsConfiguration, compactView, wrapperRef }}>
                <div
                    ref={wrapperRef}
                    className={cn(styles.component, className, {
                        [styles.wrapper]: wrapper,
                        [styles.hasPagination]: !!pagination,
                    })}
                    data-test-id={dataTestId}
                >
                    <table ref={ref} className={styles.table} {...restProps}>
                        {children}
                    </table>

                    {pagination}
                </div>
            </TableContext.Provider>
        );
    },
);
