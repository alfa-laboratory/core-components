import kebab from 'lodash.kebabcase';
import { STORYBOOK_URL } from './setupScreenshotTesting';

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
    subComponentName?: string;
    testStory?: boolean;
    knobs?: Knobs;
    mockDate?: number;
};

export type CreateSpriteStorybookUrlParams = {
    url?: string;
    packageName?: string;
    componentName: string;
    subComponentName?: string;
    knobs?: KnobsCombinations;
    size?: { width: number; height: number };
    mockDate?: number;
};

export function createStorybookUrl({
    url = STORYBOOK_URL,
    componentName,
    subComponentName = '',
    packageName = kebab(componentName),
    testStory = true,
    knobs = {},
    mockDate,
}: CreateStorybookUrlParams) {
    const knobsQuery = Object.keys(knobs).reduce(
        (acc, knobName) => `${acc}&knob-${knobName}=${knobs[knobName]}`,
        '',
    );

    if (testStory) {
        // TODO: укоротить (переписать на qs.stringify)
        return `${url}?id=компоненты--screenshots&package=${packageName}&component=${componentName}&subComponent=${subComponentName}${knobsQuery}&mockDate=${mockDate ||
            ''}`;
    }

    return `${url}?id=компоненты--${packageName}${knobsQuery}&mockDate=${mockDate || ''}`;
}

export function createSpriteStorybookUrl({
    url = STORYBOOK_URL,
    componentName,
    subComponentName = '',
    packageName = kebab(componentName),
    knobs = {},
    size,
    mockDate,
}: CreateSpriteStorybookUrlParams) {
    const sizeParam = size ? `&height=${size.height}&width=${size.width}` : '';

    // TODO: укоротить (переписать на qs.stringify)
    return `${url}?id=компоненты--screenshots-sprite&package=${packageName}&component=${componentName}&subComponent=${subComponentName}${sizeParam}&knobs=${JSON.stringify(
        knobs,
    )}&mockDate=${mockDate || ''}`;
}
