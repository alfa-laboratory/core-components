import React, { useMemo, TableHTMLAttributes, useCallback, ReactNode } from 'react';
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

export const Table: React.FC<TableProps> = ({
    className,
    children,
    compactView = false,
    wrapper = true,
    pagination,
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

    const Wrapper: React.FC = useCallback(
        wrapperProps =>
            wrapper ? (
                <div
                    className={cn(styles.wrapper, {
                        [styles.hasPagination]: !!pagination,
                    })}
                >
                    {wrapperProps.children}
                </div>
            ) : (
                <React.Fragment>{wrapperProps.children}</React.Fragment>
            ),
        [pagination, wrapper],
    );

    return (
        <TableContext.Provider value={{ columnsConfiguration, compactView }}>
            <Wrapper>
                <table
                    className={cn(styles.component, className)}
                    data-test-id={dataTestId}
                    {...restProps}
                >
                    {children}
                </table>

                {pagination}
            </Wrapper>
        </TableContext.Provider>
    );
};
