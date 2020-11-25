import { KeyboardEvent, MouseEvent, useCallback, useMemo, useRef, useState } from 'react';
import { startOfMonth, subYears, setMonth, isSameDay } from 'date-fns';
import { DateShift, Day } from './typings';

import {
    limitDate,
    generateMonths,
    generateWeeks,
    generateYears,
    dateArrayToHashTable,
    useDidUpdateEffect,
    modifyDateByShift,
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
    const dayRefs = useRef<HTMLButtonElement[]>([]);

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

    const handleItemRef = useCallback((node, day: Day) => {
        dayRefs.current[day.date.getDate() - 1] = node;
    }, []);

    const handleMouseEnter = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const { date } = (event.currentTarget as HTMLButtonElement).dataset;
        setHighlighted(date ? +date : undefined);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHighlighted(undefined);
    }, []);

    const handleClick = useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {
            const { date } = (event.currentTarget as HTMLButtonElement).dataset;

            if (date && onChange) {
                onChange(+date);
            }
        },
        [onChange],
    );

    const focusDay = useCallback(
        (shift: DateShift) => {
            const focusedNode = document.activeElement as HTMLButtonElement;

            if (!focusedNode || !focusedNode.dataset.date) return;

            const focusedDate = new Date(+focusedNode.dataset.date);
            const newDate = modifyDateByShift(shift, focusedDate, minDate, maxDate, offDaysMap);

            if (newDate < focusedDate && newDate.getMonth() !== focusedDate.getMonth()) {
                setPrevMonth();
            }

            if (newDate > focusedDate && newDate.getMonth() !== focusedDate.getMonth()) {
                setNextMonth();
            }

            setTimeout(() => {
                const newFocusedNode = dayRefs.current[newDate.getDate() - 1];

                if (window.KeyboardEvent) {
                    /**
                     * Если дата была выбрана мышкой — фокусную обводку не видно
                     * TODO: добавить в useFocus возможность переключать метод ввода программно
                     */
                    const event = new window.KeyboardEvent('keydown', {
                        bubbles: true,
                        key: 'Tab',
                    });

                    newFocusedNode.dispatchEvent(event);
                }

                newFocusedNode.focus();
            }, 0);
        },
        [maxDate, minDate, offDaysMap, setNextMonth, setPrevMonth],
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>) => {
            switch (event.key) {
                case 'ArrowLeft':
                    focusDay('prev');
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                    focusDay('next');
                    event.preventDefault();
                    break;
                case 'ArrowUp':
                    focusDay('prev_week');
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    focusDay('next_week');
                    event.preventDefault();
                    break;
                case 'End':
                    focusDay('end_of_week');
                    event.preventDefault();
                    break;
                case 'Home':
                    focusDay('start_of_week');
                    event.preventDefault();
                    break;
                case 'PageUp':
                    focusDay('prev_month');
                    event.preventDefault();
                    break;
                case 'PageDown':
                    focusDay('next_month');
                    event.preventDefault();
                    break;
                default:
                    break;
            }
        },
        [focusDay],
    );

    let focusableDayIsSet = false;

    const getDayProps = useCallback(
        (day: Day) => {
            const daySelected = selected && isSameDay(selected, day.date);
            let canFocus = daySelected;

            // Если день не выбран, то фокус должен начинаться с первого доступного дня месяца
            if (!selected && !focusableDayIsSet && !day.disabled) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                focusableDayIsSet = true;
                canFocus = true;
            }

            return {
                'data-date': day.date.getTime(),
                'aria-selected': daySelected,
                ref: (node: HTMLButtonElement) => {
                    handleItemRef(node, day);
                },
                tabIndex: canFocus ? 0 : -1,
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                onClick: handleClick,
                onKeyDown: handleKeyDown,
            };
        },
        [handleClick, handleItemRef, handleKeyDown, handleMouseEnter, handleMouseLeave, selected],
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
