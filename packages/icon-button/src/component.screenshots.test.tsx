import { Page } from 'playwright';
import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 100, height: 100 };

describe(
    'IconButton | screenshots views and sizes',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'IconButton',
            knobs: {
                view: ['primary', 'secondary', 'transparent', 'negative'],
                size: ['xxs', 'xs', 's'],
            },
            testStory: false,
        }),
        screenshotOpts: {
            clip,
        },
    }),
);

describe(
    'IconButton | inverted views',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'IconButton',
            knobs: {
                view: ['primary', 'secondary', 'transparent', 'negative'],
                inverted: true,
            },
            testStory: false,
        }),
        screenshotOpts: {
            clip,
        },
    }),
);

describe(
    'IconButton | hover',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'IconButton',
            knobs: {
                view: ['primary', 'secondary', 'transparent', 'negative'],
                inverted: [false, true],
                size: 's',
            },
            testStory: false,
        }),
        evaluate: (page: Page) => page.hover('button').then(() => page.waitForTimeout(500)),
        screenshotOpts: {
            clip,
        },
    }),
);

describe(
    'IconButton | press',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'IconButton',
            knobs: {
                view: ['primary', 'secondary', 'transparent', 'negative'],
                inverted: [false, true],
                size: 's',
            },
            testStory: false,
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
