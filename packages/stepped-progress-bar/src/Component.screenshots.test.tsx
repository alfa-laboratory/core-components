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
                        step: [0, 2, 10],
                        maxStep: 10,
                        description: 'Шаг 2 из 10: Выбор карты',
                    },
                }),
            ],
        ],
    }),
);
