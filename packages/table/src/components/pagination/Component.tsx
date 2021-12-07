import React, { FC, useMemo, useCallback } from 'react';
import cn from 'classnames';

import { Select, SelectProps } from '@alfalab/core-components-select';
import { ChevronBackMIcon } from '@alfalab/icons-glyph/ChevronBackMIcon';
import { ChevronForwardMIcon } from '@alfalab/icons-glyph/ChevronForwardMIcon';

import { Tag } from './tag';
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

    const handlePageClick = (pageIndex: number) => {
        onPageChange(pageIndex);
    };

    const handleNextPageClick = () => {
        handlePageClick(Math.min(pagesCount - 1, currentPageIndex + 1));
    };

    const handlePrevPageClick = () => {
        handlePageClick(Math.max(0, currentPageIndex - 1));
    };

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

            {pagesCount > 1 && (
                <div className={styles.pagesWrapper}>
                    <Tag
                        className={styles.tag}
                        disabled={currentPageIndex <= 0}
                        onClick={handlePrevPageClick}
                        rightAddons={<ChevronBackMIcon width={16} height={16} />}
                    />

                    {Array(pagesCount)
                        .fill('')
                        .map((_, index) => {
                            const active = currentPageIndex === index;

                            return (
                                <Tag
                                    key={index.toString()}
                                    className={cn(styles.tag, { [styles.tagActive]: active })}
                                    checked={active}
                                    disabled={active}
                                    onClick={() => handlePageClick(index)}
                                >
                                    {index + 1}
                                </Tag>
                            );
                        })}

                    <Tag
                        className={styles.tag}
                        size='xs'
                        disabled={currentPageIndex >= pagesCount - 1}
                        onClick={handleNextPageClick}
                        rightAddons={<ChevronForwardMIcon width={16} height={16} />}
                    />
                </div>
            )}
        </div>
    );
};
