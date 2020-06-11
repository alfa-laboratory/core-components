import { formatAmount } from './formatAmount';

export * from './formatAmount';
export * from './getCurrencySymbol';

/**
 * Форматирует введенное значение
 * @param enteredValue Значение введенное в инпут
 * @param currency валюта
 * @param minorUnits количество минорных единиц
 */
export function getFormatedValue(enteredValue: string, currency: string, minorUnits: number) {
    const [head, tail] = enteredValue.split(',');
    const { majorPart } = formatAmount({
        value: Number(head) * minorUnits,
        currency: { code: currency, minority: minorUnits },
    });

    if (!enteredValue) {
        return enteredValue;
    }

    if (!tail && enteredValue.includes(',')) {
        return majorPart.concat(',');
    }

    if (tail) {
        return majorPart.concat(',', tail.slice(0, 2));
    }

    return majorPart;
}

export function getAmountValueFromStr(str: string, minorUnits: number) {
    return Number(str.replace(',', '.').replace(/[^0-9.]/g, '')) * minorUnits;
}
