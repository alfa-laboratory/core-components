import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'IconView | SuperEllipse size, border',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Iconview',
            subComponentName: 'SuperEllipse',
            knobs: {
                size: [48, 64, 80, 128],
                border: [true, false],
            },
            testStory: false,
        }),
        screenshotOpts: {
            clip: { x: 0, y: 0, width: 150, height: 150 },
        },
    }),
);

describe(
    'IconView | SuperEllipse size, border, addons',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Iconview',
            subComponentName: 'SuperEllipse',
            knobs: {
                size: [48, 64, 80, 128],
                topAddons: [true, false],
                bottomAddons: [true, false],
                border: [true, false],
            },
            testStory: false,
        }),
        screenshotOpts: {
            clip: { x: 0, y: 0, width: 150, height: 150 },
        },
    }),
);

describe(
    'IconView | Circle size, border',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Iconview',
            subComponentName: 'Circle',
            knobs: {
                size: [48, 64, 80],
                border: [true, false],
            },
            testStory: false,
        }),
        screenshotOpts: {
            clip: { x: 0, y: 0, width: 150, height: 150 },
        },
    }),
);

describe(
    'IconView | Circle size, border, addons',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Iconview',
            subComponentName: 'Circle',
            knobs: {
                size: [48, 64, 80],
                topAddons: [true, false],
                bottomAddons: [true, false],
                border: [true, false],
            },
            testStory: false,
        }),
        screenshotOpts: {
            clip: { x: 0, y: 0, width: 150, height: 150 },
        },
    }),
);
