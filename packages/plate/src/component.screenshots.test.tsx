import {
    setupScreenshotTesting,
    generateTestCases,
    createSpriteStorybookUrl,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'Plate | main props',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Plate',
                    knobs: {
                        title: 'Поздравляем, полный успех',
                        children: ['', 'Вам одобрено. Согласитесь на предложение'],
                        view: ['negative', 'positive', 'attention', 'common'],
                        hasCloser: [false, true],
                        foldable: [false, true],
                    },
                    size: { width: 400, height: 120 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
        viewport: {
            width: 840,
            height: 100,
        },
    }),
);

describe(
    'Plate | buttons & addons',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Plate',
            testStory: false,
            knobs: {
                title: 'Поздравляем, полный успех',
                children: 'Вам одобрено. Согласитесь на предложение',
                buttons: true,
                leftAddons: [false, true],
            },
        }),
        viewport: { width: 500, height: 160 },
    }),
);

describe(
    'Plate | foldable with buttons & addons',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Plate',
            testStory: false,
            knobs: {
                title: 'Поздравляем, полный успех',
                children: 'Вам одобрено. Согласитесь на предложение',
                foldable: [false, true],
                leftAddons: true,
                buttons: true,
            },
        }),
        viewport: { width: 500, height: 160 },
    }),
);
