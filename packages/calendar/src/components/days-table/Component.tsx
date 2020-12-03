import React, { FC, useCallback } from 'react';
import { DayButton } from '../day-button';
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
    const selection = getSelectionRange(selectedFrom, selectedTo, highlighted);

    const renderHeader = useCallback(
        () =>
            WEEKDAYS.map(dayName => (
                <th className={styles.dayName} key={dayName}>
                    {dayName}
                </th>
            )),
        [],
    );

    const renderDay = (day: Day | null, dayIdx: number) => (
        <td key={day ? day.date.getTime() : dayIdx}>
            {day && (
                <DayButton
                    {...getDayProps(day)}
                    day={day}
                    selectedFrom={selectedFrom}
                    selectedTo={selectedTo}
                    selection={selection}
                    highlightedDate={highlighted}
                />
            )}
        </td>
    );

    const renderWeek = (week: Day[], weekIdx: number) => (
        <tr key={weekIdx}>{week.map(renderDay)}</tr>
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
