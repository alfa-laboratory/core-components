import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'Skeleton',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Skeleton',
            knobs: {
                children: 'Skeleton Skeleton Skeleton Skeleton Skeleton',
                animate: false,
                visible: [false, true],
            },
        }),
        viewport: {
            width: 200,
            height: 100,
        },
    }),
);
