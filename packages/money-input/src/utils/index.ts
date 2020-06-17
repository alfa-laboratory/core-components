/**
 * https://github.com/alfa-laboratory/utils
 * TODO: нужно перенести утилиты в этот проект, когда он будет готов
 */
import { formatAmount } from './formatAmount';
import { CurrencyCodes } from './currencyCodes';

export * from './formatAmount';

/**
 * Форматирует введенное значение
 * @param enteredValue Значение введенное в инпут
 * @param currency валюта
 * @param minority количество минорных единиц
 */
export function getFormatedValue(enteredValue: string, currency: CurrencyCodes, minority: number) {
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
    return str === '' ? null : Number(str.replace(',', '.').replace(/[^0-9.]/g, '')) * minority;
}
