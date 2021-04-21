/**
 * https://github.com/alfa-laboratory/utils
 * TODO: нужно перенести утилиты в этот проект, когда он будет готов
 */

import { formatAmount } from '@alfalab/utils';
import { CurrencyCodes } from '@alfalab/data';

/**
 * Форматирует введенное значение
 * @param enteredValue Значение введенное в инпут
 * @param currency валюта
 * @param minority количество минорных единиц
 */
export function getFormattedValue(enteredValue: string, currency: CurrencyCodes, minority: number) {
    const [head, tail] = enteredValue.split(',');
    const { majorPart } = formatAmount({
        value: Number(head) * minority,
        currency,
        minority,
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
    return str === ''
        ? null
        : Math.round(Number(str.replace(',', '.').replace(/[^0-9.]/g, '')) * minority);
}
