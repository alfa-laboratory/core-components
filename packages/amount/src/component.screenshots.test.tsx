import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 100, height: 50 };

describe(
    'Amount | screenshots',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Amount',
            knobs: {
                value: [12300],
                currency: ['RUR', 'USD'],
                minority: [100, 10],
                view: ['default', 'withZeroMinorPart'],
            },
        }),
        screenshotOpts: { clip },
    }),
);
