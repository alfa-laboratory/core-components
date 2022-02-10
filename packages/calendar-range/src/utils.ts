import { dateInLimits } from '@alfalab/core-components-calendar';
import { parseDateString } from '@alfalab/core-components-calendar-input';
import { isCompleteDateInput } from '@alfalab/core-components-date-input';
import { isSameDay } from 'date-fns';

export const isValidInputValue = (
    newInputValue: string | undefined,
    minDate: number | undefined,
    maxDate: number | undefined,
    offDays: Array<number | Date> = [],
) => {
    if (!newInputValue) return false;

    const dateValue = parseDateString(newInputValue).getTime();

    return Boolean(
        dateValue &&
            isCompleteDateInput(newInputValue) &&
            dateInLimits(dateValue, minDate, maxDate) &&
            !offDays.some(offDay => isSameDay(offDay, dateValue)),
    );
};

export const isDayButton = (node: HTMLElement | null) =>
    node && node.tagName === 'BUTTON' && node.dataset.date;
