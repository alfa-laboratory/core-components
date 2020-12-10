import { parse, format } from 'date-fns';

export const DATE_FORMAT = 'dd.MM.yyyy';
export const NATIVE_DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_MASK = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
export const IS_BROWSER = typeof window !== 'undefined';
export const SUPPORTS_INPUT_TYPE_DATE = IS_BROWSER && isInputDateSupported();

export const isCompleteDateInput = (input: string) => input.length === DATE_MASK.length;

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
