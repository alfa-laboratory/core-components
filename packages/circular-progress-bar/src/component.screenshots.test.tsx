import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'CircularProgressBar',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'CircularProgressBar',
                    knobs: {
                        value: [30, 60],
                        title: ['', 'Title'],
                        subtitle: ['', 'SubTitle'],
                        view: ['positive', 'negative'],
                        size: ['m', 'l'],
                    },
                    size: { width: 200, height: 200 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);
