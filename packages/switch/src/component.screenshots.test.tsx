import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe('Switch', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    `${theme} theme`,
                    createSpriteStorybookUrl({
                        componentName: 'Switch',
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
    'Switch | layout',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Switch',
                    knobs: {
                        label: 'Лейбл',
                        hint: 'Подсказка',
                        reversed: [false, true],
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
