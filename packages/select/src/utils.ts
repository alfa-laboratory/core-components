import { useRef, useEffect, ReactNode, isValidElement, cloneElement } from 'react';
import { OptionShape, GroupShape, BaseSelectProps } from './typings';

export const isGroup = (item: OptionShape | GroupShape): item is GroupShape =>
    Object.prototype.hasOwnProperty.call(item, 'options');

export const isOptionShape = (item: OptionShape | string | null): item is OptionShape =>
    !!item && Object.prototype.hasOwnProperty.call(item, 'key');

export const joinOptions = ({
    selected,
    selectedMultiple,
}: {
    selected?: OptionShape;
    selectedMultiple?: OptionShape[];
}) => {
    const options = selectedMultiple || (selected ? [selected] : []);

    if (!options.length) return null;

    return options.reduce((acc: Array<ReactNode | string>, option: OptionShape, index: number) => {
        if (isValidElement(option.content)) {
            acc.push(cloneElement(option.content, { key: option.key }));
        } else {
            acc.push(option.content);
        }

        if (index < options.length - 1) acc.push(', ');
        return acc;
    }, []);
};

// За один проход делает список пунктов меню плоским и находит выбранные пункты по ключу
export function processOptions(
    options: BaseSelectProps['options'],
    selected: BaseSelectProps['selected'] = [],
) {
    const flatOptions: OptionShape[] = [];

    const selectedArray = Array.isArray(selected) ? selected : [selected];
    const selectedOptions = selectedArray.filter(isOptionShape);
    const selectedKeys = selectedArray.filter(
        (option): option is string => typeof option === 'string',
    );

    const isSelected = (option: OptionShape) => selectedKeys.includes(option.key);

    const process = (option: OptionShape) => {
        flatOptions.push(option);

        if (isSelected(option)) {
            selectedOptions.push(option);
        }
    };

    options.forEach(option => {
        if (isGroup(option)) {
            option.options.forEach(process);
        } else {
            process(option);
        }
    });

    return { flatOptions, selectedOptions };
}

// TODO: перенести
export function usePrevious<T>(value: T) {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

// TODO: перенести
export const lastIndexOf = <T>(array: T[], predicate: (item: T) => boolean) => {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) return i;
    }
    return -1;
};
