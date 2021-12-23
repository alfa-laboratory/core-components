import React, { FC, useMemo, useCallback } from 'react';
import cn from 'classnames';

import { Select, SelectProps } from '@alfalab/core-components-select';
import {
    Pagination as CorePagination,
    PaginationProps as CorePaginationProps,
} from '@alfalab/core-components-pagination';
import { CustomSelectField } from './select-field';

import styles from './index.module.css';

type PaginationProps = CorePaginationProps & {
    /**
     * Количество строк на страницу
     */
    perPage?: number;

    /**
     * Возможные варианты разбивки
     */
    possiblePerPage?: number[];

    /**
     * Обработчик переключения perPage
     */
    onPerPageChange?: (perPage: number) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Pagination: FC<PaginationProps> = ({
    perPage = 25,
    possiblePerPage = [25, 50, 100],
    onPerPageChange = () => null,
    pagesCount,
    className,
    dataTestId,
    ...restPaginationProps
}) => {
    const options = useMemo(
        () =>
            Array.from(new Set<number>(possiblePerPage.concat(perPage)))
                .sort((a, b) => a - b)
                .map(value => ({
                    key: value.toString(),
                    content: `Показывать по ${value}`,
                })),
        [perPage, possiblePerPage],
    );

    const handlePerPageChange: SelectProps['onChange'] = useCallback(
        ({ selected }) => {
            onPerPageChange(Number(selected?.key));
        },
        [onPerPageChange],
    );

    if (pagesCount <= 1) return null;

    return (
        <div className={cn(styles.component, className)} data-test-id={dataTestId}>
            <Select
                options={options}
                selected={perPage.toString()}
                onChange={handlePerPageChange}
                preventFlip={false}
                size='s'
                className={styles.select}
                optionsListClassName={styles.menu}
                optionClassName={styles.option}
                Field={CustomSelectField}
            />

            <CorePagination pagesCount={pagesCount} {...restPaginationProps} />
        </div>
    );
};
