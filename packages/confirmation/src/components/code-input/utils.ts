/**
 * Начиная с указанного индекса, заменяет элементы исходного массива
 */
export const mergeArrays = ({
    sourceArray,
    targetArray,
    startIndex,
    resultArrayLength,
}: {
    sourceArray: string[];
    targetArray: string[];
    startIndex: number;
    resultArrayLength: number;
}) => {
    let insertedElemIndex = 0;

    const result = new Array(resultArrayLength).fill('');

    return result.map((_, index) => {
        if (index < startIndex) {
            return sourceArray[index] || '';
        }

        // eslint-disable-next-line no-plusplus
        return targetArray[insertedElemIndex++] || sourceArray[index] || '';
    });
};
