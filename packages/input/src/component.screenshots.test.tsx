import { Page } from 'playwright';

import {
    setupScreenshotTesting,
    generateTestCases,
    createSpriteStorybookUrl,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 350, height: 150 };

describe(
    'Input | screenshots main props',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Input',
                    knobs: {
                        label: 'Label',
                        size: ['s', 'm', 'l'],
                        block: [false, true],
                        disabled: [false, true],
                        value: ['', 'Value'],
                    },
                    size: { width: 350, height: 150 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Input | screenshots hint and error',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Input',
                    knobs: {
                        size: 'm',
                        hint: ['', 'Hint'],
                        error: ['', 'Error'],
                        value: ['', 'Value'],
                    },
                    size: { width: 350, height: 150 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Input | screenshots addons',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Input',
                    knobs: {
                        rightAddons: ['right', false],
                        leftAddons: ['left', false],
                        bottomAddons: ['bottom', false],
                        success: [false, true],
                        value: ['', 'Value'],
                    },
                    size: { width: 350, height: 150 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Input | hover state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Input',
            knobs: {
                label: ['Label'],
            },
        }),
        evaluate: (page: Page) => page.hover('input').then(() => page.waitForTimeout(500)),
        screenshotOpts: {
            clip,
        },
    }),
);
