import React, { FC } from 'react';
import cn from 'classnames';

import { ChevronBackMIcon } from '@alfalab/icons-glyph/ChevronBackMIcon';
import { ChevronForwardMIcon } from '@alfalab/icons-glyph/ChevronForwardMIcon';

import { Tag } from './components/tag';

import styles from './index.module.css';

type PaginationProps = {
    /**
     * Текущая страница (с нуля)
     */
    currentPageIndex?: number;

    /**
     * Количество страниц
     */
    pagesCount: number;

    /**
     * Дополнительный класс
     */
    className?: string;

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
    currentPageIndex = 0,
    pagesCount,
    className,
    onPageChange = () => null,
    dataTestId,
}) => {
    const handlePageClick = (pageIndex: number) => {
        onPageChange(pageIndex);
    };

    const handleNextPageClick = () => {
        handlePageClick(Math.min(pagesCount - 1, currentPageIndex + 1));
    };

    const handlePrevPageClick = () => {
        handlePageClick(Math.max(0, currentPageIndex - 1));
    };

    if (pagesCount <= 0) return null;

    return (
        <div className={cn(styles.component, className)} data-test-id={dataTestId}>
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
    );
};
