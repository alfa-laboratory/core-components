import React, { forwardRef } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';
import { isEqual, isLastDayOfMonth, isSameDay, isToday, isWithinInterval } from 'date-fns';
import { Day } from '../../typings';

import styles from './index.module.css';

export type DayProps = {
    /**
     * Объект дня с мета-данными
     */
    day: Day;

    /**
     * Начало выделенного периода
     */
    selectedFrom?: number | Date;

    /**
     * Конец выделенного периода
     */
    selectedTo?: number | Date;

    /**
     * Подсвеченная дата
     */
    highlightedDate?: number | Date;

    /**
     * Отсортированный выделенный период
     */
    selection: {
        start: Date;
        end: Date;
    } | null;
};

export const DayButton = forwardRef<HTMLButtonElement, DayProps>(
    ({ day, selectedFrom, selectedTo, highlightedDate, selection, ...restProps }, ref) => {
        const selected =
            day.selected ||
            (selectedFrom && isSameDay(day.date, selectedFrom)) ||
            (selectedTo && isSameDay(day.date, selectedTo));

        const highlighted = highlightedDate && isEqual(day.date, highlightedDate);

        const inRange = !selected && selection && isWithinInterval(day.date, selection);

        const firstDay = day.date.getDate() === 1;
        const lastDay = isLastDayOfMonth(day.date);

        const transitLeft = firstDay && inRange && selection && day.date > selection.start;
        const transitRight = lastDay && inRange && selection && day.date < selection.end;

        const rangeStart = selection && isSameDay(day.date, selection.start);

        return (
            <Button
                {...restProps}
                ref={ref}
                type='button'
                view='ghost'
                size='xs'
                disabled={day.disabled}
                className={cn(styles.day, {
                    [styles.selected]: selected,
                    [styles.range]: inRange,
                    [styles.rangeStart]: rangeStart,
                    [styles.transitLeft]: transitLeft,
                    [styles.transitRight]: transitRight,
                    [styles.today]: isToday(day.date),
                    [styles.firstDay]: firstDay,
                    [styles.lastDay]: lastDay,
                    [styles.event]: day.event,
                    [styles.disabled]: day.disabled,
                    [styles.highlighted]: highlighted,
                })}
            >
                {day.date.getDate()}
            </Button>
        );
    },
);
