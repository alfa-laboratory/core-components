import { CURRENCY_CODES, CurrencyCodes } from './currencyCodes';

/**
 * Возвращает знак валюты по ISO коду.
 *
 * @param currencyCode Код валюты.
 */
export const getCurrencySymbol = (currencyCode: CurrencyCodes): string =>
    CURRENCY_CODES[currencyCode];
