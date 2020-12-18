import { GroupShape, OptionShape, isGroup } from '@alfalab/core-components-select';

import { OptionMatcher, SelectWithTagsProps } from '../types';

const defaultMatch: OptionMatcher = (option, inputValue) =>
    option.value.toLowerCase().includes((inputValue || '').toLowerCase());

const optionsIsGroupShapes = (options: SelectWithTagsProps['options']): options is GroupShape[] => {
    const item = options[0];

    if (!item) {
        return false;
    }

    return isGroup(item);
};

export const filterOptions = (
    options: SelectWithTagsProps['options'],
    inputValue: string,
    math = defaultMatch,
) => {
    if (optionsIsGroupShapes(options)) {
        return options.reduce((acc, group) => {
            const matchedOptions = group.options.filter(option => math(option, inputValue));

            if (matchedOptions.length > 0) {
                acc.push({ ...group, options: matchedOptions });

                return acc;
            }

            return acc;
        }, [] as GroupShape[]);
    }

    return (options as OptionShape[]).filter(option => math(option, inputValue));
};
