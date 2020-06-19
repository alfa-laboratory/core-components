import { getCurrencySymbol } from './getCurrencySymbol';

import {
    THINSP,
    AMOUNT_MAJOR_PART_SIZE,
    NEGATIVE_AMOUNT_SYMBOL,
    AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR,
    AMOUNT_SPLIT_CODE_FROM,
    CurrencyCodes,
} from './currencyCodes';

/**
 * Дробит мажорную часть суммы на части по указанному символу.
 *
 * @param {String} amount Сумма для разбивки на части
 * @param {Number} [partSize=3] Размер частей суммы
 * @param {String} [splitter=THINSP] Символ, разбивающий части суммы
 * @param {String} [splitFrom=5] Длина суммы, начиная с которой необходимо осуществлять разбивку. По-умолчанию длина
 * равняется пяти по требованию гайдлайнов: https://design.alfabank.ru/patterns/amount. Пример: 2900 - не разбивается,
 * 29 000 - разбивается.
 * @returns {String}
 */

export const splitAmount = (
    amount: string,
    partSize = 3,
    splitter: string = THINSP,
    splitFrom = 5,
): string => {
    const splittingRegExp = `\\B(?=(\\d{${partSize}})+(?!\\d))`;

    // Если длина суммы меньше требуемой, не форматируем сумму
    if (amount.length < splitFrom) {
        return amount;
    }

    return amount.replace(new RegExp(splittingRegExp, 'g'), splitter);
};

/**
 * Форматирует значение суммы.
 *
 * @typedef {Object} AmountProps Параметры суммы
 * @property {Number} amount.value Абсолютное значение суммы
 * @property {Object} amount.currency Параметры валюты
 * @property {String} amount.currency.code Код валюты
 * @property {Number} amount.currency.minority Количество минорных единиц валюты
 *
 * @typedef {Object} FormattedAmountProps Параметры форматированной суммы
 * @property {String} majorPart Мажорная часть суммы
 * @property {String} minorPart Минорная часть суммы
 * @property {String} value Валюта целиком
 * @property {String} currencySymbol Символ валюты
 *
 * @param {AmountProps} amount Параметры суммы
 * @returns {FormattedAmountProps}
 */

type AmountType = {
    value: number | null;
    currency: {
        code: CurrencyCodes;
        minority: number;
    };
};

export const formatAmount = ({ value, currency: { code, minority } }: AmountType) => {
    if (value === null) {
        return {
            majorPart: '',
            minorPart: '',
            value: '',
            currencySymbol: getCurrencySymbol(code),
        };
    }

    // eslint-disable-next-line no-param-reassign
    minority = minority === 0 ? 1 : minority; // because Math.log(0) => -Infinity

    const fractionDigits = Math.log(minority) * Math.LOG10E;
    const valueAbsStr = (Math.abs(value) / minority).toFixed(fractionDigits);

    const [majorPart, minorPart] = valueAbsStr.split('.');

    const majorPartSplitted = splitAmount(
        majorPart,
        AMOUNT_MAJOR_PART_SIZE,
        THINSP,
        AMOUNT_SPLIT_CODE_FROM,
    );

    const majorPartFormatted =
        value < 0 ? NEGATIVE_AMOUNT_SYMBOL + majorPartSplitted : majorPartSplitted;

    const formattedValueStr = minorPart
        ? majorPartFormatted + AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR + minorPart
        : majorPartFormatted;

    return {
        majorPart: majorPartFormatted,
        minorPart,
        value: formattedValueStr,
        currencySymbol: getCurrencySymbol(code),
    };
};

/**
 * Форматирует значение суммы и возвращает в виде строки.
 * Использует функционал formatAmount
 *
 * @typedef {Object} AmountProps Параметры суммы
 * @property {Number} amount.value Абсолютное значение суммы
 * @property {Object} amount.currency Параметры валюты
 * @property {String} amount.currency.code Код валюты
 * @property {Number} amount.currency.minority Количество минорных единиц валюты
 *
 * @param {AmountProps} amount Параметры суммы
 * @returns {String} Форматированная сумма в виде строки
 */

export const formatAmountToString = (amount: AmountType) => {
    const { value, currencySymbol } = formatAmount(amount);

    return `${value}${THINSP}${currencySymbol}`;
};
