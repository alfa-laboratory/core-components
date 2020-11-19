import eachDayOfInterval from 'date-fns/eachDayOfInterval';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import eachYearOfInterval from 'date-fns/eachYearOfInterval';
import lastDayOfMonth from 'date-fns/lastDayOfMonth';
import startOfDay from 'date-fns/startOfDay';
import startOfMonth from 'date-fns/startOfMonth';
import startOfYear from 'date-fns/startOfYear';
import endOfYear from 'date-fns/endOfYear';
import endOfDay from 'date-fns/endOfDay';
import isEqual from 'date-fns/isEqual';
import isSameDay from 'date-fns/isSameDay';
import isBefore from 'date-fns/isBefore';
import isAfter from 'date-fns/isAfter';
import isToday from 'date-fns/isToday';
import setMonth from 'date-fns/setMonth';
import setYear from 'date-fns/setYear';
import subYears from 'date-fns/subYears';
import min from 'date-fns/min';
import max from 'date-fns/max';

import format from 'date-fns/format';
import ru from 'date-fns/locale/ru';
import { Day, Month, SpecialDays } from './typings';

export const DAYS_IN_WEEK = 7;
export const SUNDAY_INDEX = 6;

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export {
    startOfMonth,
    startOfDay,
    setMonth,
    setYear,
    subYears,
    isEqual,
    isBefore,
    isAfter,
    isSameDay,
};

/**
 * Возвращает «правильный» индекс дня недели, 0 - пн, 1 - вт и так далее.
 *
 * @param date Дата, из которой нужно получить день недели.
 */
export function russianWeekDay(date: Date): number {
    const sunday = 0;
    const foreignWeekDayIndex = date.getDay();

    return foreignWeekDayIndex === sunday ? DAYS_IN_WEEK - 1 : foreignWeekDayIndex - 1;
}

/**
 * Возвращает таблицу-календарь с заполненными датами для переданного месяца
 *
 * @param month Дата внутри месяца
 */
export function generateWeeks(
    month: Date,
    options: {
        minDate?: Date;
        maxDate?: Date;
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
 * Возвращает массиов с месяцами для переданного года
 *
 * @param year Дата внутри года
 */
export function generateMonths(year: Date, options: { minMonth: Date }) {
    return eachMonthOfInterval({ start: startOfYear(year), end: endOfYear(year) }).map(month =>
        buildMonth(month, options),
    );
}

/**
 * Возвращает массиов лет от текущего года и до minYear
 *
 * @param minYear Дата внутри минимального года
 */
export function generateYears(minYear: Date) {
    return eachYearOfInterval({
        start: startOfYear(minYear),
        end: startOfYear(new Date()),
    }).reverse();
}

export function buildDay(
    day: Date,
    options: {
        minDate?: Date;
        maxDate?: Date;
        eventsMap?: SpecialDays;
        offDaysMap?: SpecialDays;
    },
): Day {
    const { minDate, maxDate, eventsMap = {}, offDaysMap = {} } = options;

    return {
        date: day,
        disabled: (minDate && isBefore(day, minDate)) || (maxDate && isAfter(day, maxDate)),
        today: isToday(day),
        event: eventsMap[day.getTime()],
        off: offDaysMap[day.getTime()],
    };
}

export function buildMonth(month: Date, options: { minMonth?: Date }): Month {
    const { minMonth } = options;

    return {
        date: month,
        disabled: minMonth && isBefore(month, minMonth),
    };
}

/**
 * Ограничивает дату на отрезке [minDate, maxDate]
 *
 * @param date Дата
 * @param minDate Минимальная дата
 * @param maxDate Максимальная дата
 */
export function limitDate(date: Date, minDate?: Date, maxDate?: Date) {
    return min([maxDate || date, max([minDate || date, date])]);
}

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function monthName(month: Date) {
    return capitalizeFirstLetter(format(month, 'LLLL', { locale: ru }));
}

export function dateArrayToHashTable(arr: Array<Date | number>) {
    return arr.reduce((acc: Record<number, boolean>, v) => {
        acc[startOfDay(v).getTime()] = true;
        return acc;
    }, {});
}

export function isBetween(date: Date | number, minDate?: Date | number, maxDate?: Date | number) {
    return minDate && maxDate && date >= startOfDay(minDate) && date <= endOfDay(maxDate);
}
