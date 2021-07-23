import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 600, height: 200 };

describe(
    'CheckboxGroup | main props',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'CheckboxGroup',
            testStory: false,
            knobs: {
                direction: ['horizontal', 'vertical'],
                label: ['', 'Заголовок'],
                error: ['', 'Ошибка'],
                hint: ['', 'Подсказка'],
            },
        }),
        screenshotOpts: {
            clip,
        },
    }),
);

describe(
    'CheckboxGroup | disabled',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'CheckboxGroup',
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
