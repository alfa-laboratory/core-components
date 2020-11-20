import React, { FC, useCallback } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';
import { isEqual, isToday } from 'date-fns';
import { WEEKDAYS, inSelection, getSelectionRange } from '../../utils';
import { Day } from '../../typings';

import styles from './index.module.css';

export type DaysTableProps = {
    weeks?: Day[][];

    selected?: Date | number;

    selectedFrom?: Date | number;

    selectedTo?: Date | number;

    highlighted?: Date | number;

    getDayProps: (day: Day) => Record<string, unknown>;

    mode?: 'single' | 'selection';
};

export const DaysTable: FC<DaysTableProps> = ({
    weeks = [],
    mode,
    highlighted,
    selected,
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

    const selection = getSelectionRange(selectedFrom, selectedTo, selected, highlighted);

    const renderDay = (day: Day) => {
        const inRange =
            !day.selected && mode === 'selection' && inSelection(day.date, ...selection);

        return (
            <Button
                {...getDayProps(day)}
                type='button'
                view='ghost'
                size='xs'
                disabled={day.disabled}
                className={cn(styles.day, {
                    [styles.selected]: day.selected,
                    [styles.range]: inRange,
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
