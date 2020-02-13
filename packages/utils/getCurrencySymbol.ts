/**
 * Config
 */

import { CURRENCY_CODES } from '../configs/currencyCodes';

/**
 * Возвращает знак валюты по ISO коду.
 *
 * @param {String} currencyCode Код валюты.
 * @returns {String}
 */

export const getCurrencySymbol = (currencyCode: string): string => CURRENCY_CODES[currencyCode] ?? currencyCode;
