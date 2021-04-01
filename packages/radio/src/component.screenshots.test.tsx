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

const clip = { x: 0, y: 0, width: 240, height: 60 };

describe('Radio', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    `${theme} theme`,
                    createSpriteStorybookUrl({
                        componentName: 'Radio',
                        knobs: {
                            label: 'Лейбл',
                            hint: ['', 'Подсказка'],
                            checked: [false, true],
                            disabled: [false, true],
                        },
                        size: { width: 240, height: 60 },
                    }),
                ],
            ],
            screenshotOpts: {
                fullPage: true,
            },
            viewport: {
                width: 1100,
                height: 240,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
});

describe(
    'Radio | layout',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Radio',
                    knobs: {
                        label: 'Лейбл',
                        hint: 'Подсказка',
                        size: ['s', 'm'],
                        align: ['start', 'center'],
                        block: [false, true],
                    },
                    size: { width: 240, height: 60 },
                }),
            ],
        ],
        viewport: {
            width: 1100,
            height: 240,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Radio | hover state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Radio',
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
    'Radio | pressed state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Radio',
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
