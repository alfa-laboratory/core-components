import { splitAmount, formatAmount } from './formatAmount';

test('splitAmount', () => {
    expect(splitAmount('100', 3, ' ')).toBe('100');
    expect(splitAmount('1000', 3, ' ')).toBe('1000');
    expect(splitAmount('10000', 3, ' ')).toBe('10 000');
    expect(splitAmount('100000', 3, ' ')).toBe('100 000');
    expect(splitAmount('1000000', 3, ' ')).toBe('1 000 000');
    expect(splitAmount('10000000', 3, ' ')).toBe('10 000 000');
});

test('formatAmount', () => {
    const { minorPart } = formatAmount({
        withZeroMinorPart: true,
        value: 1234500,
        currency: { code: 'RUR', minority: 100 },
    });

    expect(minorPart).toBe('00');
});

test('formatAmount', () => {
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
