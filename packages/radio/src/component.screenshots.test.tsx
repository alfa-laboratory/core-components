import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe('Radio', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    `${theme} theme`,
                    createSpriteStorybookUrl({
                        componentName: 'Radio',
                        knobs: {
                            label: 'Лейбл',
                            hint: ['', 'Подсказка'],
                            checked: [false, true],
                            disabled: [false, true],
                        },
                        size: { width: 240, height: 60 },
                    }),
                ],
            ],
            screenshotOpts: {
                fullPage: true,
            },
            viewport: {
                width: 1100,
                height: 240,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
});

describe(
    'Radio | layout',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Radio',
                    knobs: {
                        label: 'Лейбл',
                        hint: 'Подсказка',
                        size: ['s', 'm'],
                        align: ['start', 'center'],
                        block: [false, true],
                    },
                    size: { width: 240, height: 60 },
                }),
            ],
        ],
        viewport: {
            width: 1100,
            height: 240,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);
