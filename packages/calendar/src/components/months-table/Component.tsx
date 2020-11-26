import React, { FC, useCallback } from 'react';
import { isSameMonth, isThisMonth } from 'date-fns';
import { SelectButton, SelectButtonProps } from '../select-button';
import { monthName } from '../../utils';
import { Month } from '../../typings';

import styles from './index.module.css';

export type MonthsTableProps = {
    months?: Month[];

    selectedMonth?: Date;

    getMonthProps: (day: Month) => Record<string, unknown>;
};

export const MonthsTable: FC<MonthsTableProps> = ({
    selectedMonth,
    months = [],
    getMonthProps,
}) => {
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
                    {...getMonthProps(month)}
                    key={month.date.getTime()}
                    className={styles.button}
                    view={view(month)}
                >
                    {monthName(month.date)}
                </SelectButton>
            ))}
        </div>
    );
};
