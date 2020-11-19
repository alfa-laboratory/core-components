import React, { FC, useCallback } from 'react';
import { Button } from '@alfalab/core-components-button';
import { monthName } from '../../utils';
import { Month } from '../../typings';

import styles from './index.module.css';

export type MonthsTableProps = {
    months?: Month[];

    onMonthClick?: (month: Date) => void;
};

export const MonthsTable: FC<MonthsTableProps> = ({ months = [], onMonthClick }) => {
    const handleMonthClick = useCallback(
        (month: Date) => {
            if (onMonthClick) onMonthClick(month);
        },
        [onMonthClick],
    );

    return (
        <div className={styles.monthsTable}>
            {months.map(({ date, disabled }) => (
                <Button
                    size='xs'
                    key={date.getTime()}
                    onClick={() => handleMonthClick(date)}
                    disabled={disabled}
                >
                    {monthName(date)}
                </Button>
            ))}
        </div>
    );
};
