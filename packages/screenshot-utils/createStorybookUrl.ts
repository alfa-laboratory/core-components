import kebab from 'lodash.kebabcase';
import { STORYBOOK_URL } from './setupScreenshotTesting';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KnobValueType = string | boolean | number | any[];

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
};

export type CreateSpriteStorybookUrlParams = {
    url?: string;
    packageName?: string;
    componentName: string;
    subComponentName?: string;
    knobs?: KnobsCombinations;
    size?: { width: number; height: number };
};

export function createStorybookUrl({
    url = STORYBOOK_URL,
    componentName,
    subComponentName = '',
    packageName = kebab(componentName),
    testStory = true,
    knobs = {},
}: CreateStorybookUrlParams) {
    const knobsQuery = Object.keys(knobs).reduce(
        (acc, knobName) => `${acc}&knob-${knobName}=${knobs[knobName]}`,
        '',
    );

    if (testStory) {
        // TODO: укоротить
        return `${url}?id=компоненты--screenshots&package=${packageName}&component=${componentName}&subComponent=${subComponentName}${knobsQuery}`;
    }

    return `${url}?id=компоненты--${packageName}${knobsQuery}`;
}

export function createSpriteStorybookUrl({
    url = STORYBOOK_URL,
    componentName,
    subComponentName = '',
    packageName = kebab(componentName),
    knobs = {},
    size,
}: CreateSpriteStorybookUrlParams) {
    const sizeParam = size ? `&height=${size.height}&width=${size.width}` : '';

    // TODO: укоротить
    return `${url}?id=компоненты--screenshots-sprite&package=${packageName}&component=${componentName}&subComponent=${subComponentName}${sizeParam}&knobs=${JSON.stringify(
        knobs,
    )}`;
}
