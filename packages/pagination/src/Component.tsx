import React, { FC, useCallback } from 'react';
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
     * Скрывает стрелки, если выбрана первая или последняя страница
     */
    hideArrows?: boolean;

    /**
     * Количество видимых страниц по бокам
     */
    sidePadding?: number;

    /**
     * Количество видимых страниц вокруг выбранной
     */
    activePadding?: number;

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
    sidePadding = 1,
    activePadding = 2,
    hideArrows = true,
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

    const maxHalfCount = sidePadding + activePadding + 1;
    const maxElementsCount = maxHalfCount * 2 + 1;
    const itemsFit = pagesCount <= maxElementsCount;
    const elementsCount = itemsFit ? pagesCount : maxElementsCount;

    const getPageIndex = useCallback(
        (elementIndex: number) => {
            const lastIndex = pagesCount - 1;
            const reverseIndex = lastIndex - currentPageIndex;
            const lastElementIndex = elementsCount - 1;
            const reverseElementIndex = lastElementIndex - elementIndex;

            const hasCollapsedItems = (index: number) => !itemsFit && index >= maxHalfCount;

            if (elementIndex < sidePadding) {
                return elementIndex;
            }

            if (elementIndex === sidePadding && hasCollapsedItems(currentPageIndex)) {
                return null;
            }

            if (reverseElementIndex === sidePadding && hasCollapsedItems(reverseIndex)) {
                return null;
            }

            if (reverseElementIndex < sidePadding) {
                return lastIndex - reverseElementIndex;
            }

            const computedIndex = currentPageIndex - maxHalfCount + elementIndex;

            return Math.min(lastIndex - reverseElementIndex, Math.max(elementIndex, computedIndex));
        },
        [currentPageIndex, elementsCount, itemsFit, maxHalfCount, pagesCount, sidePadding],
    );

    if (pagesCount <= 0) return null;

    return (
        <div className={cn(styles.component, className)} data-test-id={dataTestId}>
            {(!hideArrows || currentPageIndex > 0) && (
                <Tag
                    className={styles.tag}
                    disabled={currentPageIndex <= 0}
                    onClick={handlePrevPageClick}
                    rightAddons={<ChevronBackMIcon width={16} height={16} />}
                />
            )}

            {Array(elementsCount)
                .fill('')
                .map((_, i) => {
                    const pageIndex = getPageIndex(i);

                    if (pageIndex === null) {
                        return (
                            <div key={i.toString()} className={styles.dots}>
                                ...
                            </div>
                        );
                    }

                    const active = currentPageIndex === pageIndex;

                    return (
                        <Tag
                            key={i.toString()}
                            checked={active}
                            disabled={active}
                            onClick={() => handlePageClick(pageIndex)}
                        >
                            {pageIndex + 1}
                        </Tag>
                    );
                })}

            {(!hideArrows || currentPageIndex < pagesCount - 1) && (
                <Tag
                    className={styles.tag}
                    disabled={currentPageIndex >= pagesCount - 1}
                    onClick={handleNextPageClick}
                    rightAddons={<ChevronForwardMIcon width={16} height={16} />}
                />
            )}
        </div>
    );
};
