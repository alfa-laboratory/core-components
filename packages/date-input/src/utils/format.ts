import parse from 'date-fns/parse';
import dateFnsFormat from 'date-fns/format';
import dateFnsIsValid from 'date-fns/isValid';

export const DATE_FORMAT = 'dd.MM.yyyy';
export const NATIVE_DATE_FORMAT = 'yyyy-MM-dd';
export const DATE_MASK = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];

export const isCompleteDateInput = (input: string) => input.length === DATE_MASK.length;

export const formatDate = (date: Date | number, dateFormat = DATE_FORMAT) =>
    dateFnsFormat(date, dateFormat);

export const parseDateString = (value: string, dateFormat = DATE_FORMAT) =>
    parse(value, dateFormat, new Date());

export const isValid = (inputValue?: string) =>
    !inputValue || (isCompleteDateInput(inputValue) && dateFnsIsValid(parseDateString(inputValue)));

export const format = (value: string): string =>
    value
        .replace(/^(\d\d)(\d)$/, '$1.$2') // 121 => 12.1
        .replace(/^(\d\d)\.(\d\d)(\d)$/, '$1.$2.$3') // 12.122 => 12.12.2
        .replace(/^(\d\d)\d\.(.*)/, '$1.$2') // 123.12.2005 => 12.12.2005
        .replace(/^(\d\d\.\d\d)\d\.(.*)/, '$1.$2') // 12.123.2005 => 12.12.2005
        .replace(/^(\d\d\.\d\d\.\d\d\d\d).*/, '$1') // 12.12.20056 => 12.12.2005
        .replace(/\.$/, '') // 12. => 12
        .replace(/^(\d\d\.\d\d)(\d\d\d\d)/, '$1.$2') // 12.122005 => 12.12.2005
        .replace(/^(\d\d)(\d\d\.\d\d\d\d)/, '$1.$2'); // 1212.2005 => 12.12.2005
