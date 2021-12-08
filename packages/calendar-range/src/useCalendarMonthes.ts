import { useState, useCallback } from 'react';
import { startOfMonth, addMonths, subMonths } from 'date-fns';

import { ValueState } from './utils';

type useMonthProps = {
    defaultMonth: number;
    isPopover: boolean;
    inputValueFrom: ValueState;
    inputValueTo: ValueState;
};

export function useCalendarMonthes({
    inputValueFrom,
    inputValueTo,
    defaultMonth,
    isPopover,
}: useMonthProps) {
    const initialMonthFrom = (() => {
        if (inputValueFrom.value && inputValueFrom.date) {
            return startOfMonth(inputValueFrom.date).getTime();
        }

        return defaultMonth;
    })();

    const initialMonthTo = (() => {
        if (inputValueTo.value && inputValueTo.date) {
            return startOfMonth(inputValueTo.date).getTime();
        }

        return isPopover ? initialMonthFrom : addMonths(initialMonthFrom, 1).getTime();
    })();

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
