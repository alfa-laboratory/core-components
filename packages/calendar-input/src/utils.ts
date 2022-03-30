import parse from 'date-fns/parse';
import format from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';
import { dateInLimits } from '@alfalab/core-components-calendar';
import { isCompleteDateInput } from '@alfalab/core-components-date-input';

export const DATE_FORMAT = 'dd.MM.yyyy';
export const NATIVE_DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_MASK = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
export const IS_BROWSER = typeof window !== 'undefined';
export const SUPPORTS_INPUT_TYPE_DATE = IS_BROWSER && isInputDateSupported();

export const formatDate = (date: Date | number, dateFormat = DATE_FORMAT) =>
    format(date, dateFormat);

export const parseDateString = (value: string, dateFormat = DATE_FORMAT) =>
    parse(value, dateFormat, new Date());

/**
 * Возвращает `true`, если поддерживается `input[type="date"]`
 */
export function isInputDateSupported() {
    const input = document.createElement('input');
    const value = 'a';

    input.setAttribute('type', 'date');
    input.setAttribute('value', value);

    return input.value !== value;
}

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
