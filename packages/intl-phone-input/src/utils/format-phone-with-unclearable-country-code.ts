import { Country } from '@alfalab/utils';
import { getPhoneDiff } from './get-phone-diff';

/**
 * Форматирует телефон с неудаляемым кодом страны
 */
export const formatPhoneWithUnclearableCountryCode = (phone: string, country: Country) => {
    const countryPrefix = `+${country.dialCode}`;

    // При попытке стереть код страны возвращаем дефолтное значение
    if (phone.length < countryPrefix.length) {
        return countryPrefix;
    }

    const diffInCountryCode = getPhoneDiff(phone, country);

    // Если код страны совпадает, даем вводить значение
    if (!diffInCountryCode) {
        return phone;
    }

    const numberTail = phone.slice(countryPrefix.length + diffInCountryCode.length);

    return `${countryPrefix}${diffInCountryCode}${numberTail}`;
};
