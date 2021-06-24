import { Country } from '@alfalab/utils';
import { getPhoneDiff } from './get-phone-diff';

describe('getPhoneDiff', () => {
    it('should work', () => {
        const ru = {
            dialCode: '7',
        } as Country;

        const az = {
            dialCode: '994',
        } as Country;
        expect(getPhoneDiff('', ru)).toEqual(null);
        expect(getPhoneDiff('+', ru)).toEqual(null);
        expect(getPhoneDiff('7', ru)).toEqual(null);
        expect(getPhoneDiff('+7', ru)).toEqual(null);
        expect(getPhoneDiff('+17', ru)).toEqual('1');
        expect(getPhoneDiff('1+7', ru)).toEqual('1');

        expect(getPhoneDiff('', az)).toEqual(null);
        expect(getPhoneDiff('+', az)).toEqual(null);
        expect(getPhoneDiff('+9', az)).toEqual(null);
        expect(getPhoneDiff('+99', az)).toEqual(null);
        expect(getPhoneDiff('+994', az)).toEqual(null);
        expect(getPhoneDiff('1+994', az)).toEqual('1');
        expect(getPhoneDiff('+1994', az)).toEqual('1');
        expect(getPhoneDiff('+9194', az)).toEqual('1');
        expect(getPhoneDiff('+9914', az)).toEqual('1');
    });
});
