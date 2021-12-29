import React, { FC, useCallback } from 'react';

import { Tag } from '../tag';
import { PaginationProps } from '../../Component';

import styles from './index.module.css';

type DefaultViewProps = Pick<
    PaginationProps,
    'sidePadding' | 'activePadding' | 'pagesCount' | 'currentPageIndex' | 'onPageChange'
>;

export const DefaultView: FC<DefaultViewProps> = ({
    sidePadding = 2,
    activePadding = 1,
    pagesCount,
    currentPageIndex,
    onPageChange = () => null,
}) => {
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

    return (
        <React.Fragment>
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
                            onClick={() => onPageChange(pageIndex)}
                        >
                            {pageIndex + 1}
                        </Tag>
                    );
                })}
        </React.Fragment>
    );
};
