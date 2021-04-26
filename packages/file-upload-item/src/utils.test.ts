import { humanFileSize } from './utils';

describe('humanFileSize', () => {
    const cases = [
        [1, '1 B'],
        [10, '10 B'],
        [100, '100 B'],
        [1000, '1000 B'],
        [10000, '9.77 KB'],
        [100000, '97.66 KB'],
        [1000000, '976.56 KB'],
        [10000000, '9.54 MB'],
        [100000000, '95.37 MB'],
        [1000000000, '953.67 MB'],
        [10000000000, '9.31 GB'],
        [100000000000, '93.13 GB'],
        [1000000000000, '931.32 GB'],
        [10000000000000, '9313.23 GB'],
    ];

    it.each(cases)('humanFileSize(%i)', (a, expected) => {
        expect(humanFileSize(a)).toBe(expected);
    });
});
