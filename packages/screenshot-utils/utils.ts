/**
 * Генерирует все комбинации из элементов двумерного массива.
 * Запоминает индексы выбранных для комбинации вариантов.
 */
export function generateCombos<T>(
    list: T[][],
    n = 0,
    result: Array<Array<[T, number]>> = [],
    current: Array<[T, number]> = [],
) {
    if (n === list.length) {
        result.push(current);
    } else {
        list[n].forEach((item, i) => generateCombos(list, n + 1, result, [...current, [item, i]]));
    }

    return result;
}

export function combosToProps(combos: Array<Array<[unknown, number]>>, names: string[]) {
    return combos.map(
        combo =>
            combo.reduce(
                (props, [value], nameIndex) => ({
                    ...props,
                    [names[nameIndex]]: value,
                }),
                {} as Record<string, unknown>,
            ),
        [],
    );
}
