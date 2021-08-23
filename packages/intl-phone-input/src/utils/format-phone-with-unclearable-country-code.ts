import { Country } from '@alfalab/utils';

const RUSSIAN_DIAL_CODE = '7';
const RUSSIAN_NATIONAL_DIAL_CODE = '8';

/**
 * Форматирует телефон с неудаляемым кодом страны
 */
export const formatPhoneWithUnclearableCountryCode = (phone: string, country: Country) => {
    const countryPrefix = `+${country.dialCode}`;

    if (phone.startsWith(countryPrefix)) {
        return phone;
    }

    if (country.dialCode === RUSSIAN_DIAL_CODE && phone.startsWith(RUSSIAN_NATIONAL_DIAL_CODE)) {
        return phone.replace(RUSSIAN_NATIONAL_DIAL_CODE, countryPrefix);
    }

    if (countryPrefix.startsWith(phone) || !phone) {
        return countryPrefix;
    }

    return `${countryPrefix} ${phone}`;
};
