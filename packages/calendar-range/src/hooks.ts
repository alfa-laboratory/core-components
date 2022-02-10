import { useState, useCallback, useEffect, useMemo } from 'react';
import { startOfMonth, addMonths, subMonths, max, min, isEqual } from 'date-fns';

export function usePopoverViewMonthes({
    dateFrom,
    dateTo,
    defaultMonth,
    resetKey,
}: {
    defaultMonth: number;
    dateFrom: number | null;
    dateTo: number | null;
    resetKey?: number;
}) {
    const [monthFrom, setMonthFrom] = useState<number>();
    const [monthTo, setMonthTo] = useState<number>();

    const handleMonthFromChange = useCallback(
        (newMonthFrom: number) => {
            setMonthFrom(newMonthFrom);

            if (!dateTo) {
                setMonthTo(newMonthFrom);
            }
        },
        [dateTo],
    );

    const handleMonthToChange = useCallback(
        (newMonthTo: number) => {
            setMonthTo(newMonthTo);

            if (!dateFrom) {
                setMonthFrom(newMonthTo);
            }
        },
        [dateFrom],
    );

    useEffect(() => {
        setMonthFrom(dateFrom ? startOfMonth(dateFrom).getTime() : defaultMonth);
    }, [defaultMonth, dateFrom, resetKey]);

    useEffect(() => {
        setMonthTo(dateTo ? startOfMonth(dateTo).getTime() : monthFrom);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateTo, resetKey]);

    return {
        monthFrom,
        monthTo,
        handleMonthFromChange,
        handleMonthToChange,
    };
}

export function useStaticViewMonthes({
    selectedFrom,
    selectedTo,
    defaultMonth,
}: {
    selectedFrom?: number;
    selectedTo?: number;
    defaultMonth: number;
}) {
    /**
     * Если указана начальная дата — левый месяц равен ей, иначе используется дата конца.
     * Если обе даты не указаны, то используется дефолтный месяц
     */
    const initialMonthFrom = useMemo(
        () => startOfMonth(selectedFrom || selectedTo || defaultMonth).getTime(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    /**
     * Правый месяц должен быть как минимум на 1 месяц больше левого
     */
    const initialMonthTo = useMemo(
        () =>
            max([
                selectedTo ? startOfMonth(selectedTo) : 0,
                addMonths(initialMonthFrom, 1),
            ]).getTime(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const [monthFrom, setMonthFrom] = useState<number>(initialMonthFrom);
    const [monthTo, setMonthTo] = useState<number>(initialMonthTo);

    const handleMonthFromChange = useCallback(
        (newMonthFrom: number) => {
            setMonthFrom(newMonthFrom);

            if (monthTo && isEqual(newMonthFrom, monthTo)) {
                const nextMonth = addMonths(newMonthFrom, 1).getTime();

                setMonthTo(nextMonth);
            }
        },
        [monthTo],
    );

    const handleMonthToChange = useCallback(
        (newMonthTo: number) => {
            setMonthTo(newMonthTo);

            if (monthFrom && isEqual(newMonthTo, monthFrom)) {
                const prevMonth = subMonths(newMonthTo, 1).getTime();

                setMonthFrom(prevMonth);
            }
        },
        [monthFrom],
    );

    // eslint-disable-next-line complexity
    useEffect(() => {
        const selectedFromMonth = selectedFrom ? startOfMonth(selectedFrom).getTime() : undefined;
        const selectedToMonth = selectedTo ? startOfMonth(selectedTo).getTime() : undefined;

        // Проверяем, показываются ли выбранные месяцы в левой или правой части компонента
        const fromMonthOnLeft = selectedFromMonth && selectedFromMonth === monthFrom;
        const fromMonthOnRight = selectedFromMonth && selectedFromMonth === monthTo;
        const toMonthOnRight = selectedToMonth && selectedToMonth === monthTo;
        const toMonthOnLeft = selectedToMonth && selectedToMonth === monthFrom;
        const fromMonthOnScreen = fromMonthOnLeft || fromMonthOnRight;
        const toMonthOnScreen = toMonthOnLeft || toMonthOnRight;

        if (fromMonthOnLeft && toMonthOnLeft) {
            setMonthTo(max([addMonths(selectedFromMonth as number, 1), monthTo]).getTime());
            return;
        }

        if (fromMonthOnRight && toMonthOnRight) {
            setMonthFrom(min([subMonths(selectedToMonth as number, 1), monthFrom]).getTime());
            return;
        }

        if (selectedFromMonth && selectedToMonth) {
            setMonthFrom(selectedFromMonth);
            setMonthTo(max([addMonths(selectedFromMonth, 1), selectedToMonth]).getTime());
            return;
        }

        if (selectedFromMonth && !selectedToMonth && !fromMonthOnScreen) {
            setMonthFrom(selectedFromMonth);
            setMonthTo(max([addMonths(selectedFromMonth, 1), monthTo]).getTime());
        }

        if (selectedToMonth && !selectedFromMonth && !toMonthOnScreen) {
            setMonthTo(selectedToMonth);
            setMonthFrom(min([subMonths(selectedToMonth, 1), monthFrom]).getTime());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFrom, selectedTo]);

    return {
        monthFrom,
        monthTo,
        handleMonthFromChange,
        handleMonthToChange,
    };
}
