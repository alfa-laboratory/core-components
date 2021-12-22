import React, { FC, useMemo, useCallback } from 'react';
import cn from 'classnames';

import { Select, SelectProps } from '@alfalab/core-components-select';
import { Pagination as CorePagination } from '@alfalab/core-components-pagination';
import { CustomSelectField } from './select-field';

import styles from './index.module.css';

type PaginationProps = {
    /**
     * Количество строк на страницу
     */
    perPage?: number;

    /**
     * Текущая страница (с нуля)
     */
    currentPageIndex?: number;

    /**
     * Количество страниц
     */
    pagesCount: number;

    /**
     * Возможные варианты разбивки
     */
    possiblePerPage?: number[];

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Обработчик переключения perPage
     */
    onPerPageChange?: (perPage: number) => void;

    /**
     * Обработчик переключения страницы
     */
    onPageChange?: (pageIndex: number) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const Pagination: FC<PaginationProps> = ({
    perPage = 25,
    currentPageIndex = 0,
    pagesCount,
    possiblePerPage = [10, 25, 50, 100],
    className,
    onPageChange = () => null,
    onPerPageChange = () => null,
    dataTestId,
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

            <CorePagination
                pagesCount={pagesCount}
                currentPageIndex={currentPageIndex}
                onPageChange={onPageChange}
            />
        </div>
    );
};
