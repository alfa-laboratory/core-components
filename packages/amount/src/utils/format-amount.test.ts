import { splitAmount, formatAmount } from './format-amount';

test('splitAmount', () => {
    expect(splitAmount('100', 3, ' ')).toBe('100');
    expect(splitAmount('1000', 3, ' ')).toBe('1000');
    expect(splitAmount('10000', 3, ' ')).toBe('10 000');
    expect(splitAmount('100000', 3, ' ')).toBe('100 000');
    expect(splitAmount('1000000', 3, ' ')).toBe('1 000 000');
    expect(splitAmount('10000000', 3, ' ')).toBe('10 000 000');
});

describe('formatAmount', () => {
    it('should return not empty minorPart if passed view = "default" and value has zero minor part', () => {
        const { minorPart, formated, formatedWithCurrency } = formatAmount({
            view: 'withZeroMinorPart',
            value: 1234500,
            currency: 'RUR',
            minority: 100,
        });

        expect(minorPart).toBe('00');
        expect(formated).toBe('12 345,00');
        expect(formatedWithCurrency).toBe('12 345,00 ₽');
    });

    it('should return empty minorPart if passed view = "default" and value has zero minor part', () => {
        const { minorPart, formated, formatedWithCurrency } = formatAmount({
            view: 'default',
            value: 1234500,
            currency: 'RUR',
            minority: 100,
        });

        expect(minorPart).toBe('');
        expect(formated).toBe('12 345');
        expect(formatedWithCurrency).toBe('12 345 ₽');
    });

    it('should return zero majorPart if passed value < minority', () => {
        const { majorPart, minorPart } = formatAmount({
            view: 'withZeroMinorPart',
            value: 100,
            currency: 'RUR',
            minority: 1000,
        });

        expect(majorPart).toBe('0');
        expect(minorPart).toBe('100');
    });

    it('should format correctly', () => {
        const { majorPart, minorPart, formated, formatedWithCurrency } = formatAmount({
            view: 'default',
            value: 12345,
            currency: 'USD',
            minority: 100,
        });

        expect(majorPart).toBe('123');
        expect(minorPart).toBe('45');
        expect(formated).toBe('123,45');
        expect(formatedWithCurrency).toBe('123,45 $');
    });

    it('should add "−" to majorPart if passed negative value', () => {
        const { majorPart, minorPart, formated, formatedWithCurrency } = formatAmount({
            view: 'default',
            value: -12345,
            currency: 'RUR',
            minority: 100,
        });

        expect(majorPart).toBe('−123');
        expect(minorPart).toBe('45');
        expect(formated).toBe('−123,45');
        expect(formatedWithCurrency).toBe('−123,45 ₽');
    });
});
