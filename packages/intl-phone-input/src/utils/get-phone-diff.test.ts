import { Country } from '@alfalab/utils';
import { getPhoneDiff } from './get-phone-diff';

const ru = {
    dialCode: '7',
} as Country;

const az = {
    dialCode: '994',
} as Country;

describe('getPhoneDiff', () => {
    it('should work with short country code', () => {
        expect(getPhoneDiff('', ru)).toEqual('');
        expect(getPhoneDiff('+', ru)).toEqual('');
        expect(getPhoneDiff('7', ru)).toEqual('');
        expect(getPhoneDiff('+7', ru)).toEqual('');
        expect(getPhoneDiff('+71', ru)).toEqual('');
        expect(getPhoneDiff('+17', ru)).toEqual('1');
        expect(getPhoneDiff('1+7', ru)).toEqual('1');
        expect(getPhoneDiff('+1', ru)).toEqual('1');
    });

    it('should work with long country code', () => {
        expect(getPhoneDiff('', az)).toEqual('');
        expect(getPhoneDiff('+', az)).toEqual('');
        expect(getPhoneDiff('+9', az)).toEqual('');
        expect(getPhoneDiff('+99', az)).toEqual('');
        expect(getPhoneDiff('+994', az)).toEqual('');
        expect(getPhoneDiff('1+994', az)).toEqual('1');
        expect(getPhoneDiff('+1994', az)).toEqual('1');
        expect(getPhoneDiff('+9194', az)).toEqual('1');
        expect(getPhoneDiff('+9914', az)).toEqual('1');
        expect(getPhoneDiff('+993', az)).toEqual('3');
        expect(getPhoneDiff('+934', az)).toEqual('3');
        expect(getPhoneDiff('+394', az)).toEqual('3');
    });
});
