import { generateTestCases, setupScreenshotTesting } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 400, height: 100 };

describe(
    'Divider',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Divider',
            testStory: false,
            knobs: {},
        }),
        screenshotOpts: {
            clip,
        },
    }),
);
