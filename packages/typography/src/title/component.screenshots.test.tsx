import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'Typography.Title | all variants',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Typography',
                    subComponentName: 'Title',
                    knobs: {
                        children: 'Съешь ещё этих мягких французских булок, да выпей чаю',
                        view: ['xlarge', 'large', 'medium', 'small', 'xsmall'],
                        weight: ['regular', 'medium', 'bold'],
                        font: ['styrene', 'system'],
                    },
                    size: { width: 550, height: 350 },
                }),
            ],
        ],
        viewport: { width: 1920, height: 1080 },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Typography.Title | colors',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Typography',
                    subComponentName: 'Title',
                    knobs: {
                        color: [
                            'disabled',
                            'tertiary',
                            'accent',
                            'primary',
                            'attention',
                            'positive',
                            'secondary',
                            'tertiary-inverted',
                            'primary-inverted',
                            'secondary-inverted',
                            'link',
                            'negative',
                        ],
                        view: 'small',
                        children: 'Мягкая французская булочка',
                    },
                    size: { width: 400, height: 60 },
                }),
            ],
        ],
        viewport: { width: 900, height: 500 },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);
