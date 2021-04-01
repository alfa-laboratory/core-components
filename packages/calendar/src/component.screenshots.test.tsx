import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

jest.mock('date-fns', () => ({ isThisMonth: () => false }));

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'Calendar | defaultView',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Calendar',
                    size: { width: 350, height: 400 },
                    knobs: {
                        month: [1613310391747, 1610718391747],
                        defaultView: ['years', 'months', 'days'],
                    },
                    mockDate: 1613310391747,
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Calendar | selected value, selectorView',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Calendar',
                    size: { width: 350, height: 400 },
                    knobs: {
                        month: [1613310391747],
                        value: [1613310391747, 1613137591747],
                        selectorView: ['month-only', 'full'],
                    },
                    mockDate: 1613310391747,
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Calendar | selected range',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Calendar',
                    size: { width: 350, height: 400 },
                    knobs: {
                        month: [1613310391747],
                        selectedFrom: [1610718391747, 1613010391747],
                        selectedTo: [1613310391747, 1615902391747],
                    },
                    mockDate: 1613310391747,
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);
