import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe('Textarea | sprite', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    `${theme} - main props`,
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
                    'inverted',
                    createSpriteStorybookUrl({
                        componentName: 'Textarea',
                        knobs: {
                            value: 'Компонент текстового поля ввода.',
                            block: true,
                            label: 'Лейбл',
                            colors: 'inverted',
                            error: ['', 'error'],
                        },
                        size: { width: 240, height: 100 },
                    }),
                ],
                [
                    `${theme} - hint & error`,
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
                [
                    `${theme} - counter`,
                    createSpriteStorybookUrl({
                        componentName: 'Textarea',
                        knobs: {
                            value: 'Компонент текстового поля ввода.',
                            block: true,
                            showCounter: true,
                            maxLength: 500,
                        },
                        size: { width: 240, height: 100 },
                    }),
                ],
            ],
            screenshotOpts: {
                fullPage: true,
            },
            viewport: { width: 1024, height: 100 },
            theme,
        })();

    ['default', 'click'].map(testCase);
});
