import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'HatchingProgressBar | main props',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'HatchingProgressBar',
                    knobs: {
                        view: [
                            'positive',
                            'negative',
                            'attention',
                            'link',
                            'tertiary',
                            'secondary',
                            'primary',
                            'accent',
                        ],
                        value: 40,
                        hatchValue: 60,
                    },
                    size: { width: 130, height: 25 },
                }),
            ],
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'HatchingProgressBar',
                    knobs: {
                        value: [0, 50, 100],
                        hatchValue: [0, 80, 100],
                    },
                    size: { width: 130, height: 25 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
        viewport: {
            width: 470,
            height: 50,
        },
    }),
);
