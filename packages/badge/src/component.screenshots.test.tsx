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
    'Badge | screenshots view=`count`',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Badge',
                    knobs: {
                        view: ['count'],
                        size: ['s', 'm', 'l'],
                        content: [1, 10, 100],
                    },
                }),
            ],
        ],
        screenshotOpts: {
            clip: { x: 0, y: 0, width: 1920, height: 150 },
        },
    }),
);

describe(
    'Badge | screenshots view=`icon`',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Badge',
            knobs: {
                view: ['icon'],
                visibleIconOutline: [true, false],
                iconColor: [
                    'positive',
                    'attention',
                    'negative',
                    'tertiary',
                    'secondary',
                    'primary',
                ],
            },
            testStory: false,
        }),
        screenshotOpts: {
            clip: { x: 0, y: 0, width: 50, height: 50 },
        },
    }),
);
