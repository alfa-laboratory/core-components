import { Country } from '@alfalab/utils';
import { getPhoneDiff } from './get-phone-diff';

/**
 * Форматирует телефон с неудаляемым кодом страны
 */
export const formatPhoneWithUnclearableCountryCode = (phone: string, country: Country) => {
    const defaultValue = `+${country.dialCode}`;
    // При попытке стереть код страны возвращаем дефолтное значение
    if (phone.length < defaultValue.length) {
        return defaultValue;
    }

    // Если код страны совпадает, даем вводить значение
    if (phone.substr(1, country.dialCode.length) === country.dialCode) {
        return phone;
    }

    const lengthDiff = phone.substr(1).length - country.dialCode.length;
    // Если разница длины нового значения и длины кода страны равна 1, то определяем отличающийся символ и ставим его после кода
    if (lengthDiff === 1) {
        const diff = getPhoneDiff(phone, country);
        // Если не смогли вычислить отличающийся символ, то возвращаем дефолтное значение
        if (!diff) {
            return defaultValue;
        }

        return `+${country.dialCode}${diff}`;
    }

    return phone;
};
