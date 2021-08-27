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
                        colors: ['default', 'inverted'],
                        passwordVisible: [true, false],
                        value: 'my password',
                    },
                    size: { width: 300, height: 70 },
                }),
            ],
        ],
    }),
);
