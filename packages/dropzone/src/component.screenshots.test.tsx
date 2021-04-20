import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 450, height: 250 };

describe(
    'Dropzone | main props',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Dropzone',
            testStory: false,
            knobs: {
                error: [false, true],
                overlayVisible: [false, true],
            },
        }),
        screenshotOpts: {
            clip,
        },
    }),
);
