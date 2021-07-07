import { Country } from '@alfalab/utils';

/**
 * Возвращает разницу между значением и кодом страны
 */
export const getPhoneDiff = (value: string, country: Country) => {
    if (!value || value === `+${country.dialCode}`) return '';

    const insertionDiff = getInsertionDiff(value, country);

    if (insertionDiff) {
        return insertionDiff;
    }

    const noPlusValue = value.startsWith('+') ? value.slice(1) : value;
    const changeDiff = getChangeDiff(country.dialCode, noPlusValue);

    if (changeDiff) {
        return changeDiff;
    }

    return '';
};

// Находит символы вставляемые в код страны
function getInsertionDiff(value: string, country: Country) {
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
}

// Находит символы вводимые выделением и заменой части кода страны
function getChangeDiff(template: string, value: string) {
    let result = '';

    for (let i = 0; i < template.length; i++) {
        const targetChar = value[i];

        if (targetChar && template[i] !== targetChar) {
            result += value[i];
        }
    }

    return result;
}
