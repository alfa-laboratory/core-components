import { Page } from 'playwright';
import {
    setupScreenshotTesting,
    createSpriteStorybookUrl,
    generateTestCases,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 400, height: 100 };

describe(
    'Checkbox | size, disabled, checked',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Checkbox',
                    knobs: {
                        checked: [true, false],
                        label: ['Согласен с условиями'],
                        hint: ['Дополнительная информация'],
                        size: ['s', 'm'],
                        disabled: [true, false],
                        indeterminate: [true, false],
                    },
                    size: { width: 400, height: 100 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Checkbox | addons, block, align',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Checkbox',
                    knobs: {
                        label: ['Согласен с условиями'],
                        hint: ['Дополнительная информация'],
                        size: ['s'],
                        addons: ['', 'Addons'],
                        block: [true, false],
                        align: ['start', 'center'],
                    },
                    size: { width: 400, height: 100 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Checkbox | hover state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Checkbox',
            knobs: {
                label: ['Согласен с условиями'],
                disabled: [true, false],
            },
        }),
        evaluate: (page: Page) => page.hover('label').then(() => page.waitForTimeout(500)),
        screenshotOpts: {
            clip,
        },
    }),
);

describe(
    'Checkbox | pressed state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Checkbox',
            knobs: {
                label: ['Согласен с условиями'],
                disabled: [true, false],
            },
        }),
        evaluate: (page: Page) => {
            return page.mouse
                .move(30, 30)
                .then(() => page.mouse.down().then(() => page.waitForTimeout(500)));
        },
        screenshotOpts: {
            clip,
        },
    }),
);
