import React, { FC, MouseEvent, useCallback, useLayoutEffect, useRef } from 'react';
import { isSameYear, isThisYear } from 'date-fns';
import { SelectButton, SelectButtonProps } from '../select-button';

import styles from './index.module.css';

export type YearsTableProps = {
    /**
     * Массив лет
     */
    years?: Date[];

    /**
     * Выбранный год
     */
    selectedYear?: Date;

    /**
     * Доп. пропсы для переданного года
     */
    getYearProps: (year: Date) => Record<string, unknown>;

    /**
     * Обработчик скролла
     */
    onScroll: (scrollTop: number) => void;
};

export const YearsTable: FC<YearsTableProps> = ({
    selectedYear,
    years = [],
    getYearProps,
    onScroll,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const view = useCallback(
        (year: Date): SelectButtonProps['view'] => {
            if (selectedYear && isSameYear(selectedYear, year)) return 'selected';
            if (isThisYear(year)) return 'outlined';
            return 'default';
        },
        [selectedYear],
    );

    const handleScroll = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            onScroll(event.currentTarget.scrollTop);
        },
        [onScroll],
    );

    useLayoutEffect(() => {
        const listNode = ref.current;
        const selector = `.${styles.button}[tabIndex="0"]`;
        const selectedYearNode = listNode && listNode.querySelector<HTMLButtonElement>(selector);

        if (listNode && selectedYearNode) {
            const topIndent = listNode.clientHeight / 2 - selectedYearNode.clientHeight / 2;

            listNode.scrollTop = selectedYearNode.offsetTop - topIndent;

            onScroll(listNode.scrollTop);
        }
    }, [onScroll, selectedYear]);

    return (
        <div className={styles.yearsTable} onScroll={handleScroll} ref={ref}>
            <div className={styles.inner}>
                {years.map(year => (
                    <SelectButton
                        {...getYearProps(year)}
                        key={year.getFullYear()}
                        view={view(year)}
                        className={styles.button}
                    >
                        {year.getFullYear()}
                    </SelectButton>
                ))}
            </div>
        </div>
    );
};
