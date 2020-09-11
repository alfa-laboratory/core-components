import { mergeArrays } from './utils';

describe('Code input merge arrays', () => {
    test('Merge arrays test 1', () => {
        const sourceArray = ['1', '1', '1', '1', '1'];

        const targetArray = ['2', '2', '2'];

        const startIndex = 1;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['1', '2', '2', '2', '1']);
    });

    test('Merge arrays test 2', () => {
        const sourceArray = ['1', '1', '1', '1', '1'];

        const targetArray = ['2', '2', '2'];

        const startIndex = 0;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['2', '2', '2', '1', '1']);
    });

    test('Merge arrays test 3', () => {
        const sourceArray = ['1', '1', '1', '1', '1'];

        const targetArray = ['2', '2', '2'];

        const startIndex = 5;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['1', '1', '1', '1', '1']);
    });

    test('Merge arrays test 4', () => {
        const sourceArray = ['1', '1', '1', '1', '1'];

        const targetArray = ['2', '2', '2'];

        const startIndex = 4;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['1', '1', '1', '1', '2']);
    });

    test('Merge arrays test 5', () => {
        const sourceArray = ['1', '1', '1'];

        const targetArray = ['2', '2', '2', '2', '2'];

        const startIndex = 0;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['2', '2', '2', '2', '2']);
    });

    test('Merge arrays test 6', () => {
        const sourceArray = ['1', '1', '1'];

        const targetArray = ['2', '2', '2', '2', '2'];

        const startIndex = 1;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['1', '2', '2', '2', '2']);
    });

    test('Merge arrays test 7', () => {
        const sourceArray: string[] = [];

        const targetArray = ['2', '2'];

        const startIndex = 0;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['2', '2', '', '', '']);
    });

    test('Merge arrays test 8', () => {
        const sourceArray: string[] = [];

        const targetArray = ['2', '2'];

        const startIndex = 1;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['', '2', '2', '', '']);
    });

    test('Merge arrays test 9', () => {
        const sourceArray: string[] = [];

        const targetArray = ['2', '2', '2', '2'];

        const startIndex = 4;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['', '', '', '', '2']);
    });

    test('Merge arrays test 10', () => {
        const sourceArray: string[] = ['1', '', '', '', '1'];

        const targetArray = ['2', '2'];

        const startIndex = 2;

        const result = mergeArrays({ sourceArray, targetArray, startIndex, resultArrayLength: 5 });

        expect(result).toEqual(['1', '', '2', '2', '1']);
    });
});
