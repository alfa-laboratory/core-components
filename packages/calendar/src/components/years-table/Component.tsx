import React, { FC, MouseEvent, useCallback } from 'react';
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
    onScroll?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const YearsTable: FC<YearsTableProps> = ({
    selectedYear,
    years = [],
    getYearProps,
    onScroll,
}) => {
    const view = useCallback(
        (year: Date): SelectButtonProps['view'] => {
            if (selectedYear && isSameYear(selectedYear, year)) return 'selected';
            if (isThisYear(year)) return 'outlined';
            return 'default';
        },
        [selectedYear],
    );

    return (
        <div className={styles.yearsTable} onScroll={onScroll}>
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
