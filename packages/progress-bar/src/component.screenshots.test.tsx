import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'ProgressBar | main props',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'ProgressBar',
                    knobs: {
                        size: ['s', 'm'],
                        view: [
                            'positive',
                            'negative',
                            'attention',
                            'link',
                            'tertiary',
                            'secondary',
                            'primary',
                        ],
                        value: [0, 50, 100],
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
