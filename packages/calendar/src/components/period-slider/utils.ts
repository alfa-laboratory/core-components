import {
    addDays,
    addMonths,
    addQuarters,
    addWeeks,
    addYears,
    endOfMonth,
    endOfQuarter,
    endOfWeek,
    endOfYear,
    getQuarter,
    getYear,
    isToday,
    isYesterday,
    startOfMonth,
    startOfQuarter,
    startOfWeek,
    startOfYear,
} from 'date-fns';

import { monthName, formatDate } from '../../utils';
import { PeriodType } from '.';

export const formatPeriod = (valueFrom: Date, valueTo: Date, periodType: PeriodType) => {
    if (periodType === 'day') {
        if (isToday(valueFrom)) return 'Сегодня';
        if (isYesterday(valueFrom)) return 'Вчера';

        return formatDate(valueFrom);
    }

    if (periodType === 'month') {
        const year = getYear(valueFrom);

        return year === getYear(new Date())
            ? monthName(valueFrom)
            : `${monthName(valueFrom)} ${getYear(valueFrom)}`;
    }

    if (periodType === 'quarter') {
        return `${getQuarter(valueFrom)} квартал ${getYear(valueFrom)}`;
    }

    if (periodType === 'year') {
        return `${getYear(valueFrom)} год`;
    }

    return `${formatDate(valueFrom)} - ${formatDate(valueTo)}`;
};

export const shiftValues = (
    valueFrom: Date,
    valueTo: Date,
    periodType: PeriodType,
    direction: 'prev' | 'next',
) => {
    let newValueFrom = valueFrom;
    let newValueTo = valueTo;

    const amount = direction === 'next' ? 1 : -1;

    switch (periodType) {
        case 'day':
            newValueFrom = addDays(valueFrom, amount);
            newValueTo = addDays(valueFrom, amount);
            break;
        case 'week':
            newValueFrom = startOfWeek(addWeeks(valueFrom, amount), { weekStartsOn: 1 });
            newValueTo = endOfWeek(newValueFrom, { weekStartsOn: 1 });
            break;
        case 'month':
            newValueFrom = startOfMonth(addMonths(valueFrom, amount));
            newValueTo = endOfMonth(newValueFrom);
            break;
        case 'quarter':
            newValueFrom = startOfQuarter(addQuarters(valueFrom, amount));
            newValueTo = endOfQuarter(newValueFrom);
            break;
        case 'year':
            newValueFrom = startOfYear(addYears(valueFrom, amount));
            newValueTo = endOfYear(newValueFrom);
            break;
        default:
            break;
    }

    return {
        valueFrom: newValueFrom,
        valueTo: newValueTo,
    };
};
