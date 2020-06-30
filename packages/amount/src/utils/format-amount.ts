import { CurrencyCodes, getCurrencySymbol } from './currency-codes';

const AMOUNT_MAJOR_PART_SIZE = 3;
const AMOUNT_SPLIT_CODE_FROM = 4;
const NEGATIVE_AMOUNT_SYMBOL = '−';

export const THINSP = String.fromCharCode(8201); // &thinsp;
export const AMOUNT_MAJOR_MINOR_PARTS_SEPARATOR = ',';

/**
 * Дробит мажорную часть суммы на части по указанному символу.
 *
 * @param amount Сумма для разбивки на части
 * @param partSize Размер частей суммы
 * @param splitter Символ, разбивающий части суммы
 * @param splitFrom Длина суммы, начиная с которой необходимо осуществлять разбивку. По-умолчанию длина
 * равняется пяти по требованию гайдлайнов: https://design.alfabank.ru/patterns/amount. Пример: 2900 - не разбивается,
 * 29 000 - разбивается.
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

type AmountType = {
    /**
     * Денежное значение в минорных единицах
     */
    value: number;

    /**
     * Валюта
     */
    currency: CurrencyCodes;

    /**
     * Количество минорных единиц в валюте
     */
    minority: number;

    /**
     * default - не отображаем копейки, если из значение 0
     * withZeroMinorPart - отображаем копейки, даже если их значение равно 0
     */
    view?: 'default' | 'withZeroMinorPart';
};

/**
 * Форматирует значение суммы
 * согласно гайдлайну https://design.alfabank.ru/patterns/amount
 */
export const formatAmount = ({ value, currency, minority, view }: AmountType) => {
    if (value === null) {
        return {
            majorPart: '',
            minorPart: '',
            formated: '',
            currencySymbol: getCurrencySymbol(currency),
            formatedWithCurrency: THINSP + getCurrencySymbol(currency),
        };
    }

    // eslint-disable-next-line no-param-reassign
    minority = minority === 0 ? 1 : minority; // because Math.log(0) => -Infinity

    const fractionDigits = Math.log(minority) * Math.LOG10E;
    const valueAbsStr = (Math.abs(value) / minority).toFixed(fractionDigits);

    const [majorPart] = valueAbsStr.split('.');
    let [, minorPart] = valueAbsStr.split('.');

    if (view === 'default' && value % minority === 0) {
        minorPart = '';
    }

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
        currencySymbol: getCurrencySymbol(currency),
        formated: formattedValueStr,
        formatedWithCurrency: formattedValueStr + THINSP + getCurrencySymbol(currency),
    };
};
