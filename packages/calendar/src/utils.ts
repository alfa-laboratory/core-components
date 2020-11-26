import {
    eachDayOfInterval,
    eachMonthOfInterval,
    eachYearOfInterval,
    lastDayOfMonth,
    startOfDay,
    startOfMonth,
    startOfYear,
    endOfYear,
    isSameDay,
    isBefore,
    isAfter,
    min,
    max,
    addDays,
    addMonths,
    endOfWeek,
    startOfWeek,
    subDays,
    subMonths,
} from 'date-fns';
import { useRef, useEffect } from 'react';
import { DateShift, Day, Month, SpecialDays } from './typings';

export const DAYS_IN_WEEK = 7;
export const MONTHS_IN_YEAR = 12;
export const SUNDAY_INDEX = 6;

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
export const MONTHS = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];

/**
 * Возвращает «правильный» индекс дня недели, 0 - пн, 1 - вт и так далее.
 */
export function russianWeekDay(date: Date): number {
    const sunday = 0;
    const foreignWeekDayIndex = date.getDay();

    return foreignWeekDayIndex === sunday ? DAYS_IN_WEEK - 1 : foreignWeekDayIndex - 1;
}

/**
 * Возвращает таблицу-календарь с заполненными датами для переданного месяца
 */
export function generateWeeks(
    month: Date,
    options: {
        minDate?: Date;
        maxDate?: Date;
        selected?: Date;
        eventsMap?: SpecialDays;
        offDaysMap?: SpecialDays;
    },
) {
    const newWeek = () => Array(DAYS_IN_WEEK).fill(null);

    const start = startOfMonth(month);
    const end = lastDayOfMonth(start);

    let week = newWeek();

    return eachDayOfInterval({ start, end }).reduce((weeks: Day[][], day: Date) => {
        const weekDay = russianWeekDay(day);

        week[weekDay] = buildDay(day, options);

        if (weekDay === SUNDAY_INDEX || isSameDay(day, end)) {
            weeks.push(week);
            week = newWeek();
        }

        return weeks;
    }, []);
}

/**
 * Возвращает массив с месяцами для переданного года
 */
export function generateMonths(year: Date, options: { minMonth?: Date; maxMonth?: Date }) {
    return eachMonthOfInterval({ start: startOfYear(year), end: endOfYear(year) }).map(month =>
        buildMonth(month, options),
    );
}

/**
 * Возвращает массив лет от текущего года и до minYear
 */
export function generateYears(minYear: Date) {
    return eachYearOfInterval({
        start: startOfYear(minYear),
        end: startOfYear(new Date()),
    }).reverse();
}

/**
 * Добавляет метаданные для переданного дня
 */
export function buildDay(
    day: Date,
    options: {
        minDate?: Date;
        maxDate?: Date;
        selected?: Date;
        eventsMap?: SpecialDays;
        offDaysMap?: SpecialDays;
    },
): Day {
    const { minDate, maxDate, selected, eventsMap = {}, offDaysMap = {} } = options;
    const off = offDaysMap[day.getTime()];
    const disabled = (minDate && isBefore(day, minDate)) || (maxDate && isAfter(day, maxDate));

    return {
        date: day,
        disabled: disabled || off,
        event: eventsMap[day.getTime()],
        selected: selected && isSameDay(day, selected),
    };
}

/**
 * Добавляет метаданные для переданного месяца
 */
export function buildMonth(month: Date, options: { minMonth?: Date; maxMonth?: Date }): Month {
    const { minMonth, maxMonth } = options;

    return {
        date: month,
        disabled: (minMonth && isBefore(month, minMonth)) || (maxMonth && isAfter(month, maxMonth)),
    };
}

/**
 * Ограничивает дату на отрезке [minDate, maxDate]
 */
export function limitDate(date: Date, minDate?: Date, maxDate?: Date) {
    return min([maxDate || date, max([minDate || date, date])]);
}

/**
 * Возвращает русское название месяца с большой буквы
 */
export function monthName(month: Date) {
    return MONTHS[month.getMonth()];
}

/**
 * Превращает массив в объект, у которого ключи составляются из элементов массива
 */
export function dateArrayToHashTable(arr: Array<Date | number>) {
    return arr.reduce((acc: Record<number, boolean>, v) => {
        acc[startOfDay(v).getTime()] = true;
        return acc;
    }, {});
}

/**
 * Возвращает корректный отрезок дат для выделения
 */
export function getSelectionRange(
    from?: Date | number,
    to?: Date | number,
    highlighted?: Date | number,
) {
    const end = to || highlighted;

    if (from && end && from !== end) {
        return {
            start: min([from, end]),
            end: max([from, end]),
        };
    }

    return null;
}

// Меняет дату одним из способов с учетом границ и выходных дней
export function modifyDateByShift(
    shift: DateShift,
    date: Date,
    minDate?: Date,
    maxDate?: Date,
    offDaysMap: Record<number, boolean> = {},
) {
    const modifiers: Record<DateShift, () => Date> = {
        prev: () => subDays(date, 1),
        prevWeek: () => subDays(date, 7),
        prevMonth: () => subMonths(date, 1),
        next: () => addDays(date, 1),
        nextWeek: () => addDays(date, 7),
        nextMonth: () => addMonths(date, 1),
        startOfWeek: () => startOfWeek(date, { weekStartsOn: 1 }),
        endOfWeek: () => startOfDay(endOfWeek(date, { weekStartsOn: 1 })),
    };

    let newDate = modifiers[shift]();

    while (offDaysMap[newDate.getTime()]) {
        // Перескакиваем через выходные дни, кроме случая с концом недели
        const amount = newDate < date || shift === 'endOfWeek' ? -1 : 1;
        newDate = addDays(newDate, amount);
    }

    return limitDate(newDate, minDate, maxDate);
}

/**
 * Если дата была выбрана мышкой — фокусную обводку не видно
 * TODO: добавить в useFocus возможность переключать метод ввода программно
 */
export function simulateTab(node: HTMLElement) {
    if (window.KeyboardEvent) {
        const event = new window.KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Tab',
        });

        node.dispatchEvent(event);
    }
}

// TODO: перенести в @alfalab/hooks?
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
