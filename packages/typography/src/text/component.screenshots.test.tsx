import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'Typography.Text | all variants',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Typography',
                    subComponentName: 'Text',
                    knobs: {
                        children: 'Съешь ещё этих мягких французских булок, да выпей чаю',
                        view: [
                            'primary-large',
                            'primary-medium',
                            'primary-small',
                            'secondary-large',
                            'secondary-medium',
                            'secondary-small',
                            'component',
                            'caps',
                        ],
                        weight: ['regular', 'medium', 'bold'],
                    },
                    size: { width: 250, height: 100 },
                }),
            ],
        ],
        viewport: { width: 1100, height: 100 },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Typography.Text | colors',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Typography',
                    subComponentName: 'Text',
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
                        view: 'primary-medium',
                        children: 'Мягкая французская булочка',
                    },
                    size: { width: 260, height: 40 },
                }),
            ],
        ],
        viewport: { width: 600, height: 100 },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);
