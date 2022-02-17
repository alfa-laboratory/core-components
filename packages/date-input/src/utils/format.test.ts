import { format } from './format';

describe('Add dots tests', () => {
    test('#1', () => {
        expect(format('1')).toBe('1');
    });

    test('#2', () => {
        expect(format('12')).toBe('12');
    });

    test('#3', () => {
        expect(format('123')).toBe('12.3');
    });

    test('#4', () => {
        expect(format('12.12')).toBe('12.12');
    });

    test('#5', () => {
        expect(format('12.122')).toBe('12.12.2');
    });

    test('#6', () => {
        expect(format('12.12.20')).toBe('12.12.20');
    });

    test('#7', () => {
        expect(format('12.12.200')).toBe('12.12.200');
    });

    test('#8', () => {
        expect(format('12.12.2009')).toBe('12.12.2009');
    });

    test('#9', () => {
        expect(format('12.12.2')).toBe('12.12.2');
    });

    test('#10', () => {
        expect(format('12.12.')).toBe('12.12');
    });

    test('#11', () => {
        expect(format('12.')).toBe('12');
    });

    test('#12', () => {
        expect(format('091.11.2021')).toBe('09.11.2021');
    });

    test('#13', () => {
        expect(format('09.110.2021')).toBe('09.11.2021');
    });

    test('#14', () => {
        expect(format('09.11.20213')).toBe('09.11.2021');
    });

    test('#15', () => {
        expect(format('10.122005')).toBe('10.12.2005');
    });

    test('#16', () => {
        expect(format('1012.2005')).toBe('10.12.2005');
    });
});
