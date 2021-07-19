import { Country } from '@alfalab/utils';
import { formatPhoneWithUnclearableCountryCode } from './format-phone-with-unclearable-country-code';

describe('formatPhoneWithUnclearableCountryCode', () => {
    it('shoul change 8 to +7 at russian country code', () => {
        const ru = {
            dialCode: '7',
        } as Country;

        expect(formatPhoneWithUnclearableCountryCode('8171', ru)).toEqual('+7171');
    });

    it('should work with long country code', () => {
        const az = {
            dialCode: '994',
        } as Country;

        expect(formatPhoneWithUnclearableCountryCode('', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('+', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('+9', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('+99', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('+994', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('1+994', az)).toEqual('+994');
        expect(formatPhoneWithUnclearableCountryCode('+9941', az)).toEqual('+9941');
    });
});
