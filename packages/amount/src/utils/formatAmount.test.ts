import { splitAmount, formatAmount } from './formatAmount';

test('splitAmount', () => {
    expect(splitAmount('100', 3, ' ')).toBe('100');
    expect(splitAmount('1000', 3, ' ')).toBe('1000');
    expect(splitAmount('10000', 3, ' ')).toBe('10 000');
    expect(splitAmount('100000', 3, ' ')).toBe('100 000');
    expect(splitAmount('1000000', 3, ' ')).toBe('1 000 000');
    expect(splitAmount('10000000', 3, ' ')).toBe('10 000 000');
});

describe('formatAmount', () => {
    test('should return minorityPart if passed withZeroMinorPart = true', () => {
        const { minorPart } = formatAmount({
            withZeroMinorPart: true,
            value: 1234500,
            currency: { code: 'RUR', minority: 100 },
        });

        expect(minorPart).toBe('00');
    });

    test('should return "00" minorPart if passed withZeroMinorPart = true and value has zero minor part', () => {
        const { minorPart } = formatAmount({
            withZeroMinorPart: true,
            value: 1234500,
            currency: { code: 'RUR', minority: 100 },
        });

        expect(minorPart).toBe('00');
    });

    test('should return null minorPart if passed withZeroMinorPart = false and value has zero minor part', () => {
        const { minorPart } = formatAmount({
            withZeroMinorPart: false,
            value: 1234500,
            currency: { code: 'RUR', minority: 100 },
        });

        expect(minorPart).toBeNull();
    });

    test('should return zero majorPart if passed value < minority', () => {
        const { majorPart, minorPart } = formatAmount({
            withZeroMinorPart: true,
            value: 100,
            currency: { code: 'RUR', minority: 1000 },
        });

        expect(majorPart).toBe('0');
        expect(minorPart).toBe('100');
    });

    test('should right calculate majorPart and minorPart', () => {
        const { majorPart, minorPart } = formatAmount({
            withZeroMinorPart: true,
            value: 12345,
            currency: { code: 'RUR', minority: 100 },
        });

        expect(majorPart).toBe('123');
        expect(minorPart).toBe('45');
    });
});
