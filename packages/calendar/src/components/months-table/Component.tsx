import React, { FC, useCallback } from 'react';
import { isSameMonth, isThisMonth } from 'date-fns';
import { SelectButton, SelectButtonProps } from '../select-button';
import { monthName } from '../../utils';
import { Month } from '../../typings';

import styles from './index.module.css';

export type MonthsTableProps = {
    months?: Month[];

    selectedMonth?: Date;

    onMonthClick?: (month: Date) => void;
};

export const MonthsTable: FC<MonthsTableProps> = ({ selectedMonth, months = [], onMonthClick }) => {
    const handleMonthClick = useCallback(
        (date: Date) => {
            if (onMonthClick) onMonthClick(date);
        },
        [onMonthClick],
    );

    const view = useCallback(
        (month: Month): SelectButtonProps['view'] => {
            if (selectedMonth && isSameMonth(selectedMonth, month.date)) return 'selected';
            if (isThisMonth(month.date)) return 'outlined';
            return 'default';
        },
        [selectedMonth],
    );

    return (
        <div className={styles.monthsTable}>
            {months.map(month => (
                <SelectButton
                    key={month.date.getTime()}
                    onClick={() => handleMonthClick(month.date)}
                    className={styles.button}
                    disabled={month.disabled}
                    view={view(month)}
                >
                    {monthName(month.date)}
                </SelectButton>
            ))}
        </div>
    );
};
