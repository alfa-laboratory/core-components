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

const clip = { x: 0, y: 0, width: 350, height: 40 };

describe(
    'Link',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Link',
                    size: { width: 250, height: 40 },
                    knobs: {
                        view: ['primary', 'secondary', 'default'],
                        pseudo: [true, false],
                        children: 'Вернуться в интернет-банк',
                    },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Link | addons',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Link',
            knobs: {
                leftAddons: [true, false],
                rightAddons: [true, false],
            },
            testStory: false,
        }),
        screenshotOpts: { clip },
    }),
);
