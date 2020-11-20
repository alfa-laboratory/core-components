import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { startOfMonth, subYears, setMonth } from 'date-fns';
import { Day } from './typings';

import {
    limitDate,
    generateMonths,
    generateWeeks,
    generateYears,
    dateArrayToHashTable,
    useDidUpdateEffect,
} from './utils';

export type UseCalendarProps = {
    defaultMonth?: Date;

    minDate?: Date;

    maxDate?: Date;

    selected?: Date;

    events?: Array<Date | number>;

    offDays?: Array<Date | number>;

    onMonthChange?: (month: number) => void;

    onChange?: (date: number) => void;
};

export function useCalendar({
    defaultMonth = startOfMonth(new Date()),
    minDate = subYears(defaultMonth, 100),
    maxDate,
    selected,
    events = [],
    offDays = [],
    onMonthChange,
    onChange,
}: UseCalendarProps) {
    const [month, setMonthState] = useState(defaultMonth);
    const [highlighted, setHighlighted] = useState<Date | number>();

    const minMonth = minDate && startOfMonth(minDate);
    const maxMonth = maxDate && startOfMonth(maxDate);

    const canSetPrevMonth = minMonth ? month > minMonth : true;
    const canSetNextMonth = maxMonth ? month < maxMonth : true;

    const eventsMap = useMemo(() => dateArrayToHashTable(events), [events]);

    const offDaysMap = useMemo(() => dateArrayToHashTable(offDays), [offDays]);

    const weeks = useMemo(
        () => generateWeeks(month, { minDate, maxDate, selected, eventsMap, offDaysMap }),
        [maxDate, minDate, selected, month, eventsMap, offDaysMap],
    );

    const months = useMemo(() => generateMonths(month, { minMonth, maxMonth }), [
        minMonth,
        maxMonth,
        month,
    ]);

    const years = useMemo(() => generateYears(minDate), [minDate]);

    const setMonthByStep = useCallback(
        (step: number) => {
            setMonthState(limitDate(setMonth(month, month.getMonth() + step), minMonth, maxMonth));
        },
        [maxMonth, minMonth, month],
    );

    const setMonthByDate = useCallback(
        (newMonth: Date) => {
            setMonthState(limitDate(newMonth, minMonth, maxMonth));
        },
        [maxMonth, minMonth],
    );

    const setNextMonth = useCallback(() => {
        setMonthByStep(1);
    }, [setMonthByStep]);

    const setPrevMonth = useCallback(() => {
        setMonthByStep(-1);
    }, [setMonthByStep]);

    const getDayProps = useCallback(
        (day: Day) => {
            return {
                'data-date': day.date.getTime(),
                onMouseEnter: (event: MouseEvent<HTMLButtonElement>) => {
                    const { date } = (event.currentTarget as HTMLButtonElement).dataset;
                    setHighlighted(date ? +date : undefined);
                },
                onMouseLeave: () => {
                    setHighlighted(undefined);
                },
                onClick: (event: MouseEvent<HTMLButtonElement>) => {
                    const { date } = (event.currentTarget as HTMLButtonElement).dataset;

                    if (date && onChange) {
                        onChange(+date);
                    }
                },
            };
        },
        [onChange],
    );

    useDidUpdateEffect(() => {
        if (onMonthChange) {
            onMonthChange(month.getTime());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [month.getMonth()]);

    return {
        month,
        weeks,
        months,
        years,
        canSetPrevMonth,
        canSetNextMonth,
        highlighted,
        setPrevMonth,
        setNextMonth,
        setMonthByDate,
        getDayProps,
    };
}
