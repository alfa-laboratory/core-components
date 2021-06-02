import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe('Amount | screenshots', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    `${theme} theme`,
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
            screenshotOpts: {
                fullPage: true,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
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
                        currency: 'RUR',
                        minority: 100,
                        view: 'withZeroMinorPart',
                        majorBold: [false, true],
                        minorBold: [false, true],
                        minorColor: ['inherit', 'transparent'],
                    },
                    size: { width: 100, height: 50 },
                }),
            ],
        ],
    }),
);
