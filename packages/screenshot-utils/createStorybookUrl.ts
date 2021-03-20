import { STORYBOOK_URL } from './setupScreenshotTesting';
import { snakeToCamel } from './utils';

export type KnobValueType = string | boolean | number;

export type KnobsCombinations = {
    [key: string]: KnobValueType | KnobValueType[];
};

export type Knobs = {
    [key: string]: KnobValueType;
};

export type CreateStorybookUrlParams = {
    url?: string;
    packageName?: string;
    componentName: string;
    knobs?: Knobs;
};

export function createStorybookUrl({
    url = STORYBOOK_URL,
    componentName,
    packageName = snakeToCamel(componentName),
    knobs = {},
}: CreateStorybookUrlParams) {
    const knobsQuery = Object.keys(knobs).reduce(
        (acc, knobName) => `${acc}&knob-${knobName}=${knobs[knobName]}`,
        '',
    );

    return `${url}?id=компоненты--screenshots&package=${packageName}&component=${componentName}${knobsQuery}`;
}
