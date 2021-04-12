import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 600, height: 200 };

describe(
    'RadioGroup | main props',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'RadioGroup',
            testStory: false,
            knobs: {
                direction: ['horizontal', 'vertical'],
                label: ['', 'Заголовок'],
                error: ['', 'Ошибка'],
            },
        }),
        screenshotOpts: {
            clip,
        },
    }),
);

describe(
    'RadioGroup | disabled',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'RadioGroup',
            testStory: false,
            knobs: {
                disabled: true,
            },
        }),
        screenshotOpts: {
            clip,
        },
    }),
);
