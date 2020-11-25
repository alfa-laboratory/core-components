import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';
import { isEqual, isSameDay, isToday, isWithinInterval } from 'date-fns';
import { WEEKDAYS, getSelectionRange } from '../../utils';
import { Day } from '../../typings';

import styles from './index.module.css';

export type DaysTableProps = {
    weeks?: Day[][];

    selectedFrom?: Date | number;

    selectedTo?: Date | number;

    highlighted?: Date | number;

    getDayProps: (day: Day) => Record<string, unknown>;
};

export const DaysTable: FC<DaysTableProps> = ({
    weeks = [],
    highlighted,
    selectedFrom,
    selectedTo,
    getDayProps,
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

    const selection = getSelectionRange(selectedFrom, selectedTo, highlighted);

    const renderDay = (day: Day) => {
        const daySelected =
            day.selected ||
            (selectedFrom && isSameDay(day.date, selectedFrom)) ||
            (selectedTo && isSameDay(day.date, selectedTo));

        const inRange = !daySelected && selection && isWithinInterval(day.date, selection);

        const rangeStart = selectedFrom && isSameDay(day.date, selectedFrom);

        return (
            <Button
                {...getDayProps(day)}
                type='button'
                view='ghost'
                size='xs'
                disabled={day.disabled}
                className={cn(styles.day, {
                    [styles.selected]: daySelected,
                    [styles.range]: inRange,
                    [styles.rangeStart]: rangeStart,
                    [styles.today]: isToday(day.date),
                    [styles.event]: day.event,
                    [styles.disabled]: day.disabled,
                    [styles.highlighted]: highlighted && isEqual(day.date, highlighted),
                })}
            >
                {day.date.getDate()}
            </Button>
        );
    };

    const renderWeek = (week: Day[], weekIdx: number) => (
        <tr key={weekIdx}>
            {week.map((day: Day, dayIdx: number) => (
                // eslint-disable-next-line react/no-array-index-key
                <td key={dayIdx}>{day && renderDay(day)}</td>
            ))}
        </tr>
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
