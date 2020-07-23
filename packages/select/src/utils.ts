import { useRef, useEffect, ReactNode, isValidElement, cloneElement } from 'react';
import { OptionShape, GroupShape } from './typings';

export const isGroup = (item: OptionShape | GroupShape): item is GroupShape =>
    Object.prototype.hasOwnProperty.call(item, 'options');

export const joinOptions = (options: OptionShape[]) =>
    options.reduce((acc: Array<ReactNode | string>, option: OptionShape, index: number) => {
        if (isValidElement(option.text)) {
            acc.push(cloneElement(option.text, { key: option.value }));
        } else {
            acc.push(option.text || option.value);
        }

        if (index < options.length - 1) acc.push(', ');
        return acc;
    }, []);

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
