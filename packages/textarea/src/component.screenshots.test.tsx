import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'Textarea | sprite',
    screenshotTesting({
        cases: [
            [
                'main props',
                createSpriteStorybookUrl({
                    componentName: 'Textarea',
                    knobs: {
                        value: 'Компонент текстового поля ввода.',
                        block: true,
                        size: ['s', 'm', 'l', 'xl'],
                        label: ['', 'Лейбл'],
                    },
                    size: { width: 240, height: 100 },
                }),
            ],
            [
                'hint & error',
                createSpriteStorybookUrl({
                    componentName: 'Textarea',
                    knobs: {
                        value: 'Компонент текстового поля ввода.',
                        block: true,
                        error: ['', 'Ошибка'],
                        hint: ['', 'Подсказка'],
                    },
                    size: { width: 240, height: 100 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
        viewport: { width: 1024, height: 100 },
    }),
);
