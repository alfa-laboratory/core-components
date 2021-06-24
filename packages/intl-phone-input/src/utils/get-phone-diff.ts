import { Country } from '@alfalab/utils';

/**
 * Возвращает разницу между значением и кодом страны
 */
export const getPhoneDiff = (value: string, country: Country) => {
    if (!value || value === `+${country.dialCode}`) return null;

    const dialRegex = country.dialCode.split('').reduce((acc, item, index) => {
        return `${acc}(?<dial${index}>\\d+)*${item}`;
    }, '');
    const regex = new RegExp(`(?<beforePlusSign>\\d+)*\\+${dialRegex}`);

    const result = value.match(regex);

    if (!result) return null;
    // eslint-disable-next-line no-prototype-builtins
    if (!result.hasOwnProperty('groups')) return null;
    const { groups } = result;
    if (!groups) return null;

    return Object.values(groups).join('');
};
