import { startOfMonth, endOfMonth } from 'date-fns';

import { limitDate } from '@alfalab/core-components-calendar';

type useMaxMinDatesProps = {
    isPopover: boolean;
    monthTo: number;
    monthFrom: number;
    selectedTo?: number;
    selectedFrom?: number;
    maxDate?: number;
    minDate?: number;
};

export function useCalendarMaxMinDates({
    isPopover,
    monthTo,
    monthFrom,
    selectedTo,
    selectedFrom,
    maxDate,
    minDate,
}: useMaxMinDatesProps) {
    const popoverFromMaxDate = selectedTo || maxDate;
    const fromMaxDate = limitDate(endOfMonth(monthFrom), minDate, maxDate).getTime();

    const popoverToMinDate = selectedFrom || minDate;
    const toMinDate = limitDate(startOfMonth(monthTo), minDate, maxDate).getTime();

    return {
        fromMinDate: minDate,
        toMaxDate: maxDate,
        fromMaxDate: isPopover ? popoverFromMaxDate : fromMaxDate,
        toMinDate: isPopover ? popoverToMinDate : toMinDate,
    };
}
