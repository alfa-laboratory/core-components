import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    limitDate,
    generateMonths,
    generateWeeks,
    generateYears,
    startOfMonth,
    subYears,
    setMonth,
    dateArrayToHashTable,
} from './utils';

export type UseCalendarProps = {
    defaultMonth?: Date;

    minDate?: Date;

    maxDate?: Date;

    events?: Array<Date | number>;

    offDays?: Array<Date | number>;

    onMonthChange?: (month: Date) => void;
};

export function useDidUpdateEffect(fn: () => void, deps: unknown[]) {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current) {
            fn();
        } else {
            didMountRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export function useCalendar({
    defaultMonth = startOfMonth(new Date()),
    minDate = subYears(defaultMonth, 100),
    maxDate,
    events = [],
    offDays = [],
    onMonthChange,
}: UseCalendarProps) {
    const [month, setMonthState] = useState(defaultMonth);

    const minMonth = minDate && startOfMonth(minDate);
    const maxMonth = maxDate && startOfMonth(maxDate);

    const canSetPrevMonth = minMonth ? month > minMonth : true;
    const canSetNextMonth = maxMonth ? month < maxMonth : true;

    const eventsMap = useMemo(() => dateArrayToHashTable(events), [events]);

    const offDaysMap = useMemo(() => dateArrayToHashTable(offDays), [offDays]);

    const weeks = useMemo(() => generateWeeks(month, { minDate, maxDate, eventsMap, offDaysMap }), [
        maxDate,
        minDate,
        month,
        eventsMap,
        offDaysMap,
    ]);

    const months = useMemo(() => generateMonths(month, { minMonth }), [minMonth, month]);

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

    useDidUpdateEffect(() => {
        if (onMonthChange) {
            onMonthChange(month);
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
        setPrevMonth,
        setNextMonth,
        setMonthByDate,
    };
}
