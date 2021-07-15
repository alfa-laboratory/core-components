import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'SteppedProgressBar | main props',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'SteppedProgressBar',
                    knobs: {
                        step: [-2, 0, 2, 10, 12],
                        maxStep: [-10, 0, 10],
                        description: ['Шаг 2 из 10: Выбор карты', ''],
                    },
                }),
            ],
        ],
    }),
);
