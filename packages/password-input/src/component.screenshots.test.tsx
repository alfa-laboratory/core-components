import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'PasswordInput | screenshots',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'PasswordInput',
                    knobs: {
                        passwordVisible: [true, false],
                        value: 'my password',
                    },
                    size: { width: 300, height: 70 },
                }),
            ],
        ],
        screenshotOpts: {
            clip: { x: 0, y: 0, width: 600, height: 150 },
        },
    }),
);
