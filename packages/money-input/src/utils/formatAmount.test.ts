import { splitAmount } from './formatAmount';

test('splitAmount', () => {
    expect(splitAmount('100', 3, ' ')).toBe('100');
    expect(splitAmount('1000', 3, ' ')).toBe('1000');
    expect(splitAmount('10000', 3, ' ')).toBe('10 000');
    expect(splitAmount('100000', 3, ' ')).toBe('100 000');
    expect(splitAmount('1000000', 3, ' ')).toBe('1 000 000');
    expect(splitAmount('10000000', 3, ' ')).toBe('10 000 000');
});
