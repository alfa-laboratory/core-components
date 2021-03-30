import {
    setupScreenshotTesting,
    createSpriteStorybookUrl,
    generateTestCases,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'Tag | sprite',
    screenshotTesting({
        cases: [
            [
                'main props',
                createSpriteStorybookUrl({
                    componentName: 'Tag',
                    knobs: {
                        children: 'Оплатить',
                        size: ['xl', 'l', 'm', 's', 'xs'],
                        checked: [false, true],
                        disabled: [false, true],
                    },
                    size: { width: 160, height: 90 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
        viewport: { width: 740, height: 100 },
    }),
);

describe(
    'Tag | right addons',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Tag',
            testStory: false,
            knobs: {
                rightAddons: true,
                checked: [false, true],
                disabled: [false, true],
            },
        }),
        screenshotOpts: {
            fullPage: true,
        },
        viewport: { width: 180, height: 80 },
    }),
);
