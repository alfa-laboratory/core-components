import React, { FC } from 'react';
import cn from 'classnames';

import { ChevronBackMIcon } from '@alfalab/icons-glyph/ChevronBackMIcon';
import { ChevronForwardMIcon } from '@alfalab/icons-glyph/ChevronForwardMIcon';

import { Tag } from './components/tag';
import { DefaultView } from './components/default-view';
import { PerPageView } from './components/per-page-view';

import styles from './index.module.css';

export type PaginationProps = {
    /**
     * Текущая страница (с нуля)
     */
    currentPageIndex: number;

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
     * Режим пагинации
     */
    view?: 'default' | 'per-page';

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
    view = 'default',
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

    const shouldRenderPrevArrow = view === 'per-page' || !hideArrows || currentPageIndex > 0;
    const shouldRenderNextArrow =
        view === 'per-page' || !hideArrows || currentPageIndex < pagesCount - 1;

    return (
        <div className={cn(styles.component, className, styles[view])} data-test-id={dataTestId}>
            {shouldRenderPrevArrow && (
                <Tag
                    className={styles.arrow}
                    disabled={currentPageIndex <= 0}
                    onClick={handlePrevPageClick}
                    rightAddons={<ChevronBackMIcon width={16} height={16} />}
                />
            )}

            {view === 'default' && (
                <DefaultView
                    activePadding={activePadding}
                    sidePadding={sidePadding}
                    currentPageIndex={currentPageIndex}
                    pagesCount={pagesCount}
                    onPageChange={handlePageClick}
                />
            )}

            {view === 'per-page' && (
                <PerPageView currentPageIndex={currentPageIndex} pagesCount={pagesCount} />
            )}

            {shouldRenderNextArrow && (
                <Tag
                    className={styles.arrow}
                    disabled={currentPageIndex >= pagesCount - 1}
                    onClick={handleNextPageClick}
                    rightAddons={<ChevronForwardMIcon width={16} height={16} />}
                />
            )}
        </div>
    );
};
