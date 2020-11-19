import React, { FC, useCallback } from 'react';
import { Button } from '@alfalab/core-components-button';
import { Day } from '../../typings';
import { WEEKDAYS, isSameDay, isBetween } from '../../utils';

import styles from './index.module.css';

export type DaysTableProps = {
    weeks?: Day[][];

    selected?: Date | number;

    selectedFrom?: Date | number;

    selectedTo?: Date | number;
};

export const DaysTable: FC<DaysTableProps> = ({
    weeks = [],
    selected,
    selectedFrom = selected,
    selectedTo = selected,
}) => {
    const renderHeader = useCallback(
        () =>
            WEEKDAYS.map(dayName => (
                <th className={styles.dayName} key={dayName}>
                    {dayName}
                </th>
            )),
        [],
    );

    const renderDay = useCallback(
        (day: Day, i: number) => {
            return (
                <td key={i}>
                    {day && (
                        <Button size='xs' disabled={day.disabled}>
                            {day.date.getDate()}
                            {selected && isSameDay(day.date, selected) && 'selected'}
                            {isBetween(day.date, selectedFrom, selectedTo) && '*'}
                            {day.today && 'today'}
                            {day.event && 'event'}
                            {day.off && 'off'}
                        </Button>
                    )}
                </td>
            );
        },
        [selected, selectedFrom, selectedTo],
    );

    const renderWeek = useCallback(
        (week: Day[], i: number) => <tr key={i}>{week.map(renderDay)}</tr>,
        [renderDay],
    );

    return (
        <table className={styles.daysTable}>
            <thead>
                <tr>{renderHeader()}</tr>
            </thead>
            <tbody>{weeks.map(renderWeek)}</tbody>
        </table>
    );
};
