import { parse, format } from 'date-fns';

export const DATE_FORMAT = 'dd.MM.yyyy';
export const NATIVE_DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_MASK = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];

export const isCompleteDateInput = (input: string) => input.length === DATE_MASK.length;

export const formatDate = (date: Date | number, dateFormat = DATE_FORMAT) =>
    format(date, dateFormat);

export const parseDateString = (value: string, dateFormat = DATE_FORMAT) =>
    parse(value, dateFormat, new Date());
