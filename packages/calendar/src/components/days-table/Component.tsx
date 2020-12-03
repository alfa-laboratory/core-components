import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';
import { isEqual, isLastDayOfMonth, isSameDay, isToday, isWithinInterval } from 'date-fns';
import { WEEKDAYS, getSelectionRange } from '../../utils';
import { Day } from '../../typings';

import styles from './index.module.css';

export type DaysTableProps = {
    /**
     * Массив-календарь недель
     */
    weeks?: Day[][];

    /**
     * Начало выделенного периода
     */
    selectedFrom?: Date | number;

    /**
     * Конец выделенного периода
     */
    selectedTo?: Date | number;

    /**
     * Подсвеченная дата (ховер)
     */
    highlighted?: Date | number;

    /**
     * Доп. пропсы для переданного дня
     */
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

        const firstDay = day.date.getDate() === 1;
        const lastDay = isLastDayOfMonth(day.date);

        const transitLeft = firstDay && inRange && selection && day.date > selection.start;
        const transitRight = lastDay && inRange && selection && day.date < selection.end;

        const rangeStart = selection && isSameDay(day.date, selection.start);

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
                    [styles.transitLeft]: transitLeft,
                    [styles.transitRight]: transitRight,
                    [styles.today]: isToday(day.date),
                    [styles.firstDay]: firstDay,
                    [styles.lastDay]: lastDay,
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
                <td key={day ? day.date.getTime() : dayIdx}>{day && renderDay(day)}</td>
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
