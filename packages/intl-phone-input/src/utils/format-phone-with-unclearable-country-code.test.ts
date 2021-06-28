import { Country } from '@alfalab/utils';
import { formatPhoneWithUnclearableCountryCode } from './format-phone-with-unclearable-country-code';

describe('formatPhoneWithUnclearableCountryCode', () => {
    it('should work', () => {
        const ru = {
            dialCode: '7',
        } as Country;

        const az = {
            dialCode: '994',
        } as Country;
        expect(formatPhoneWithUnclearableCountryCode('', ru)).toEqual('+7');
        expect(formatPhoneWithUnclearableCountryCode('+', ru)).toEqual('+7');
        expect(formatPhoneWithUnclearableCountryCode('7', ru)).toEqual('+7');
        expect(formatPhoneWithUnclearableCountryCode('+7', ru)).toEqual('+7');
        expect(formatPhoneWithUnclearableCountryCode('+17', ru)).toEqual('+71');
        expect(formatPhoneWithUnclearableCountryCode('+71', ru)).toEqual('+71');
        expect(formatPhoneWithUnclearableCountryCode('1+7', ru)).toEqual('+71');

        expect(formatPhoneWithUnclearableCountryCode('', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('+', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('+9', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('+99', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('+994', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('1+994', az)).toEqual('+9941');
        expect(formatPhoneWithUnclearableCountryCode('+1994', az)).toEqual('+9941');
        expect(formatPhoneWithUnclearableCountryCode('+9194', az)).toEqual('+9941');
        expect(formatPhoneWithUnclearableCountryCode('+9914', az)).toEqual('+9941');
        expect(formatPhoneWithUnclearableCountryCode('+9941', az)).toEqual('+9941');
    });
});
