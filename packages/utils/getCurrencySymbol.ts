import { CURRENCY_CODES } from '../configs/currencyCodes';

/**
 * Возвращает знак валюты по ISO коду.
 *
 * @param currencyCode Код валюты.
 */
export const getCurrencySymbol = (currencyCode: string): string =>
    CURRENCY_CODES[currencyCode] ?? currencyCode;
