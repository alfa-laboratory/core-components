import { KeyboardEvent, MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import { startOfMonth, setMonth, isSameDay, isSameMonth, isSameYear, setYear } from 'date-fns';
import {
    limitDate,
    generateMonths,
    generateWeeks,
    generateYears,
    dateArrayToHashTable,
    useDidUpdateEffect,
    modifyDateByShift,
    simulateTab,
    MONTHS_IN_YEAR,
} from './utils';
import { DateShift, Day, Month, View } from './typings';

export type UseCalendarProps = {
    /**
     * Активный вид (выбор дней, месяцев, лет)
     */
    view?: View;

    /**
     * Начальный месяц
     */
    defaultMonth: Date;

    /**
     * Минимальная дата, доступная для выбора
     */
    minDate: Date;

    /**
     * Максимальная дата, доступная для выбора
     */
    maxDate?: Date;

    /**
     * Выбранная дата
     */
    selected?: Date;

    /**
     * Список событий
     */
    events?: Array<Date | number>;

    /**
     * Список выходных дней
     */
    offDays?: Array<Date | number>;

    /**
     * Обработчик изменения месяца (или года)
     */
    onMonthChange?: (month: number) => void;

    /**
     * Обработчик выбора даты
     */
    onChange?: (date: number) => void;
};

export function useCalendar({
    defaultMonth,
    minDate,
    view = 'days',
    maxDate,
    selected,
    events,
    offDays,
    onMonthChange,
    onChange,
}: UseCalendarProps) {
    const [activeMonth, setActiveMonth] = useState(defaultMonth);
    const [highlighted, setHighlighted] = useState<Date | number>();

    const dateRefs = useRef<HTMLButtonElement[]>([]);
    const rootRef = useRef<HTMLDivElement>(null);

    const minMonth = useMemo(() => minDate && startOfMonth(minDate), [minDate]);
    const maxMonth = useMemo(() => maxDate && startOfMonth(maxDate), [maxDate]);

    const canSetPrevMonth = minMonth ? activeMonth > minMonth : true;
    const canSetNextMonth = maxMonth ? activeMonth < maxMonth : true;

    const eventsMap = useMemo(() => dateArrayToHashTable(events || []), [events]);

    const offDaysMap = useMemo(() => dateArrayToHashTable(offDays || []), [offDays]);

    const weeks = useMemo(
        () => generateWeeks(activeMonth, { minDate, maxDate, selected, eventsMap, offDaysMap }),
        [maxDate, minDate, selected, activeMonth, eventsMap, offDaysMap],
    );

    const months = useMemo(() => generateMonths(activeMonth, { minMonth, maxMonth }), [
        minMonth,
        maxMonth,
        activeMonth,
    ]);

    const years = useMemo(() => generateYears(minDate), [minDate]);

    const setMonthByStep = useCallback(
        (step: number) => {
            setActiveMonth(
                limitDate(setMonth(activeMonth, activeMonth.getMonth() + step), minMonth, maxMonth),
            );
        },
        [maxMonth, minMonth, activeMonth],
    );

    const setMonthByDate = useCallback(
        (newMonth: Date) => {
            setActiveMonth(limitDate(newMonth, minMonth, maxMonth));
        },
        [maxMonth, minMonth],
    );

    const setNextMonth = useCallback(() => {
        setMonthByStep(1);
    }, [setMonthByStep]);

    const setPrevMonth = useCallback(() => {
        setMonthByStep(-1);
    }, [setMonthByStep]);

    const getFocusedDate = useCallback(
        () => dateRefs.current.find(node => document.activeElement === node),
        [],
    );

    const getFocusableDate = useCallback(
        () => dateRefs.current.find(node => node && node.tabIndex === 0),
        [],
    );

    const focusDate = useCallback((node?: HTMLElement) => {
        if (node) {
            simulateTab(node);
            node.focus();
        }
    }, []);

    const focusFirstAvailableDate = useCallback(() => focusDate(getFocusableDate()), [
        focusDate,
        getFocusableDate,
    ]);

    const focusDay = useCallback(
        (shift: DateShift) => {
            const focusedNode = getFocusedDate();

            if (focusedNode && focusedNode.dataset.date) {
                const focusedDate = new Date(+focusedNode.dataset.date);
                const newDate = modifyDateByShift(shift, focusedDate, minDate, maxDate, offDaysMap);

                if (newDate < focusedDate && newDate.getMonth() !== focusedDate.getMonth()) {
                    setPrevMonth();
                }

                if (newDate > focusedDate && newDate.getMonth() !== focusedDate.getMonth()) {
                    setNextMonth();
                }

                setTimeout(() => focusDate(dateRefs.current[newDate.getDate() - 1]), 0);
            } else {
                focusFirstAvailableDate();
            }
        },
        [
            focusDate,
            focusFirstAvailableDate,
            getFocusedDate,
            maxDate,
            minDate,
            offDaysMap,
            setNextMonth,
            setPrevMonth,
        ],
    );

    const focusMonth = useCallback(
        (offset: number) => {
            const focusedNode = getFocusedDate();

            if (focusedNode && focusedNode.dataset.date) {
                const focusedMonth = new Date(+focusedNode.dataset.date).getMonth();
                const newFocusedMonth = focusedMonth + offset;

                if (newFocusedMonth >= 0 && newFocusedMonth < MONTHS_IN_YEAR) {
                    focusDate(dateRefs.current[newFocusedMonth]);
                }
            } else {
                focusFirstAvailableDate();
            }
        },
        [focusDate, focusFirstAvailableDate, getFocusedDate],
    );

    const focusYear = useCallback(
        (offset: number) => {
            const focusedNode = getFocusedDate();

            if (focusedNode && focusedNode.dataset.date) {
                const focusedYear = new Date(+focusedNode.dataset.date).getFullYear();
                const newFocusedYear = focusedYear + offset;
                const currentYear = new Date().getFullYear();

                if (newFocusedYear <= currentYear && newFocusedYear > currentYear - years.length) {
                    focusDate(dateRefs.current[newFocusedYear]);
                }
            } else {
                focusFirstAvailableDate();
            }
        },
        [focusDate, focusFirstAvailableDate, getFocusedDate, years.length],
    );

    const handleMonthClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const { date } = (event.currentTarget as HTMLButtonElement).dataset;

            if (date) {
                setMonthByDate(new Date(+date));
            }

            if (rootRef.current) rootRef.current.focus();
        },
        [setMonthByDate],
    );

    const handleYearClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const { date } = (event.currentTarget as HTMLButtonElement).dataset;

            if (date) {
                setMonthByDate(setYear(activeMonth, new Date(+date).getFullYear()));
            }

            if (rootRef.current) rootRef.current.focus();
        },
        [activeMonth, setMonthByDate],
    );

    const handleDateRef = useCallback((node, index: number) => {
        dateRefs.current[index] = node;
    }, []);

    const handleDayMouseEnter = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const { date } = (event.currentTarget as HTMLButtonElement).dataset;
        setHighlighted(date ? +date : undefined);
    }, []);

    const handleDayMouseLeave = useCallback(() => {
        setHighlighted(undefined);
    }, []);

    const handleDayClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const { date } = (event.currentTarget as HTMLButtonElement).dataset;

            if (date && onChange) {
                onChange(+date);
            }
        },
        [onChange],
    );

    const daysControls = useMemo(
        (): { [key: string]: () => void } => ({
            ArrowLeft: () => focusDay('prev'),
            ArrowRight: () => focusDay('next'),
            ArrowUp: () => focusDay('prevWeek'),
            ArrowDown: () => focusDay('nextWeek'),
            End: () => focusDay('endOfWeek'),
            Home: () => focusDay('startOfWeek'),
            PageUp: () => focusDay('prevMonth'),
            PageDown: () => focusDay('nextMonth'),
        }),
        [focusDay],
    );

    const monthControls = useMemo(
        (): { [key: string]: () => void } => ({
            ArrowLeft: () => focusMonth(-1),
            ArrowRight: () => focusMonth(1),
            ArrowUp: () => focusMonth(-3),
            ArrowDown: () => focusMonth(3),
        }),
        [focusMonth],
    );

    const yearsControls = useMemo(
        (): { [key: string]: () => void } => ({
            ArrowLeft: () => focusYear(1),
            ArrowRight: () => focusYear(-1),
            ArrowUp: () => focusYear(3),
            ArrowDown: () => focusYear(-3),
        }),
        [focusYear],
    );

    const controlsByView = {
        days: daysControls,
        months: monthControls,
        years: yearsControls,
    };

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const controls = controlsByView[view];

            if (event.key in controls) {
                controls[event.key]();
                event.preventDefault();
            }
        },
        [controlsByView, view],
    );

    let focusableDayIsSet = false;

    const getDayProps = useCallback(
        (day: Day) => {
            const daySelected = selected && isSameDay(selected, day.date);
            let canFocus = daySelected;

            // Если день не выбран — фокус должен начинаться с первого доступного дня месяца
            if (
                (!selected || !isSameMonth(selected, activeMonth)) &&
                !focusableDayIsSet &&
                !day.disabled
            ) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                focusableDayIsSet = true;
                canFocus = true;
            }

            return {
                'data-date': day.date.getTime(),
                'aria-selected': daySelected,
                ref: (node: HTMLButtonElement) => {
                    handleDateRef(node, day.date.getDate() - 1);
                },
                tabIndex: canFocus ? 0 : -1,
                onMouseEnter: handleDayMouseEnter,
                onMouseLeave: handleDayMouseLeave,
                onClick: handleDayClick,
            };
        },
        [
            handleDayClick,
            handleDateRef,
            handleKeyDown,
            handleDayMouseEnter,
            handleDayMouseLeave,
            selected,
        ],
    );

    const getMonthProps = useCallback(
        (month: Month) => {
            const monthselected = isSameMonth(activeMonth, month.date);
            return {
                'data-date': month.date.getTime(),
                'aria-selected': monthselected,
                ref: (node: HTMLButtonElement) => {
                    handleDateRef(node, month.date.getMonth());
                },
                tabIndex: monthselected ? 0 : -1,
                disabled: month.disabled,
                onClick: handleMonthClick,
            };
        },
        [activeMonth, handleDateRef, handleMonthClick],
    );

    const getYearProps = useCallback(
        (year: Date) => {
            const yearSelected = isSameYear(activeMonth, year);

            return {
                'data-date': year.getTime(),
                'aria-selected': yearSelected,
                ref: (node: HTMLButtonElement) => {
                    handleDateRef(node, year.getFullYear());
                },
                tabIndex: yearSelected ? 0 : -1,
                onClick: handleYearClick,
            };
        },
        [activeMonth, handleDateRef, handleYearClick],
    );

    const getRootProps = useCallback(() => {
        return {
            onKeyDown: handleKeyDown,
            ref: rootRef,
            tabIndex: -1,
        };
    }, [handleKeyDown]);

    useDidUpdateEffect(() => {
        if (onMonthChange) {
            onMonthChange(activeMonth.getTime());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeMonth.getMonth()]);

    return {
        activeMonth,
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
        getMonthProps,
        getYearProps,
        getRootProps,
    };
}
