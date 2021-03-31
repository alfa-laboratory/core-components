import {
    setupScreenshotTesting,
    createSpriteStorybookUrl,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'Amount | screenshots',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Amount',
                    knobs: {
                        value: [12300],
                        currency: ['RUR', 'USD'],
                        minority: [100, 10],
                        view: ['default', 'withZeroMinorPart'],
                    },
                    size: { width: 100, height: 50 },
                }),
            ],
        ],
    }),
);
