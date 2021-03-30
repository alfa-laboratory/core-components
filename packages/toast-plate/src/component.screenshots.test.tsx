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

const clip = { x: 0, y: 0, width: 480, height: 100 };

describe(
    'ToastPlate | main props',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'ToastPlate',
                    knobs: {
                        children: 'Вам одобрено. Согласитесь на предложение',
                        badge: ['attention', 'positive', 'negative', ''],
                        title: ['', 'Поздравляем, полный успех'],
                        hasCloser: [false, true],
                    },
                    size: clip,
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'ToastPlate | action button',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'ToastPlate',
            testStory: false,
            knobs: {
                children: 'Вам одобрено',
                title: 'Поздравляем',
                renderActionButton: true,
            },
        }),
        screenshotOpts: {
            clip,
        },
    }),
);
