import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 300, height: 70 };

describe(
    'AmountInput | screenshots',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'AmountInput',
            knobs: {
                value: [12300],
                currency: ['RUR', 'USD'],
                minority: [100],
                view: ['default', 'withZeroMinorPart'],
                bold: [true, false],
            },
        }),
        screenshotOpts: { clip },
    }),
);
