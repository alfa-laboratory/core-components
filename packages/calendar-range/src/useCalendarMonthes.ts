import { useState, useCallback } from 'react';
import { startOfMonth, addMonths, subMonths } from 'date-fns';

import { ValueState, PickPeriod, isEmptyDate } from './utils';

type useMonthProps = {
    defaultMonth: number;
    isPopover: boolean;
    inputValueFrom: ValueState;
    inputValueTo: ValueState;
    pickPeriod: PickPeriod;
};

export function useCalendarMonthes({
    inputValueFrom,
    inputValueTo,
    defaultMonth,
    isPopover,
    pickPeriod,
}: useMonthProps) {
    const getInitialMonthes = (): { initialMonthFrom: number; initialMonthTo: number } => {
        let initialMonthFrom = 0;
        let initialMonthTo = 0;

        if (pickPeriod === 'in-future') {
            initialMonthFrom = isEmptyDate(inputValueFrom)
                ? defaultMonth
                : startOfMonth(inputValueFrom.date as number).getTime();

            initialMonthTo = isPopover
                ? initialMonthFrom
                : addMonths(initialMonthFrom, 1).getTime();
        } else {
            initialMonthTo = isEmptyDate(inputValueTo)
                ? defaultMonth
                : startOfMonth(inputValueTo.date as number).getTime();
            initialMonthFrom = isPopover ? initialMonthTo : subMonths(initialMonthTo, 1).getTime();
        }

        return {
            initialMonthFrom,
            initialMonthTo,
        };
    };

    const { initialMonthFrom, initialMonthTo } = getInitialMonthes();

    const [monthFrom, setMonthFrom] = useState(initialMonthFrom);
    const [monthTo, setMonthTo] = useState(initialMonthTo);

    const handleMonthFromChange = useCallback(
        (newMonthFrom: number) => {
            setMonthFrom(newMonthFrom);

            if (!isPopover) {
                const nextMonth = addMonths(newMonthFrom, 1).getTime();

                setMonthTo(nextMonth);

                return;
            }

            if (!inputValueTo.date) {
                setMonthTo(newMonthFrom);
            }
        },
        [isPopover, setMonthFrom, setMonthTo, inputValueTo],
    );

    const handleMonthToChange = useCallback(
        (newMonthTo: number) => {
            setMonthTo(newMonthTo);

            if (!isPopover) {
                const prevMonth = subMonths(newMonthTo, 1).getTime();

                setMonthFrom(prevMonth);

                return;
            }

            if (!inputValueFrom.date) {
                setMonthFrom(newMonthTo);
            }
        },
        [isPopover, setMonthFrom, setMonthTo, inputValueFrom],
    );

    return {
        monthFrom,
        monthTo,
        handleMonthFromChange,
        handleMonthToChange,
    };
}
