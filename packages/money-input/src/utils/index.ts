import { formatAmount } from './formatAmount';

export * from './formatAmount';
export * from './getCurrencySymbol';

/**
 * Форматирует введенное значение
 * @param enteredValue Значение введенное в инпут
 * @param currency валюта
 * @param minority количество минорных единиц
 */
export function getFormatedValue(enteredValue: string, currency: string, minority: number) {
    const [head, tail] = enteredValue.split(',');
    const { majorPart } = formatAmount({
        value: Number(head) * minority,
        currency: { code: currency, minority },
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

export function getAmountValueFromStr(str: string, minority: number) {
    return Number(str.replace(',', '.').replace(/[^0-9.]/g, '')) * minority;
}
