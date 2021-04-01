import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 600, height: 250 };

describe(
    'CheckboxGroup',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'CheckboxGroup',
            knobs: {
                direction: ['horizontal', 'vertical'],
                error: ['', 'Error'],
                disabled: [true, false],
            },
            testStory: false,
        }),
        screenshotOpts: {
            clip,
        },
    }),
);
