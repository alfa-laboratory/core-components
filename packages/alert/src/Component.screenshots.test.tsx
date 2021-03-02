import { screenshotTesting, getComponentScreenshotTestCases } from '../../utils';

const clip = { x: 0, y: 0, width: 1920, height: 100 };

describe(
    'Alert | screenshots views',
    screenshotTesting({
        cases: getComponentScreenshotTestCases({
            componentName: 'alert',
            knobs: {
                view: ['common', 'negative', 'positive', 'attention'],
            },
        }),
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe(
    'Alert | screenshots with title and closer',
    screenshotTesting({
        cases: getComponentScreenshotTestCases({
            componentName: 'alert',
            knobs: {
                title: ['Title', ''],
                hasCloser: [true, false],
            },
        }),
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);
