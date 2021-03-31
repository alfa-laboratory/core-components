import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'AmountInput | screenshots',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'AmountInput',
                    knobs: {
                        value: [12300],
                        currency: ['RUR', 'USD'],
                        minority: [100],
                        bold: [true, false],
                    },
                    size: { width: 300, height: 70 },
                }),
            ],
        ],
    }),
);
