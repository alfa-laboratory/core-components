import { screenshotTesting, getComponentScreenshotTestCases } from '../../utils';

const viewsSizesCases = getComponentScreenshotTestCases({
    componentName: 'button',
    knobs: {
        view: ['primary', 'secondary', 'outlined', 'filled', 'link', 'ghost'],
        size: ['xs', 's', 'm', 'l'],
    },
});

const viewsDisabledCases = getComponentScreenshotTestCases({
    componentName: 'button',
    knobs: {
        view: ['primary', 'secondary', 'outlined', 'filled', 'link', 'ghost'],
        disabled: [true],
    },
});

const viewsBlockCases = getComponentScreenshotTestCases({
    componentName: 'button',
    knobs: {
        view: ['primary', 'secondary', 'outlined', 'filled', 'link', 'ghost'],
        block: [true],
    },
});

const viewsLoadingCases = getComponentScreenshotTestCases({
    componentName: 'button',
    knobs: {
        view: ['primary', 'secondary', 'outlined', 'filled', 'link', 'ghost'],
        loading: [true],
    },
});

const clip = { x: 0, y: 0, width: 200, height: 100 };

describe(
    'Button | screenshots views and sizes',
    screenshotTesting({
        cases: viewsSizesCases,
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe(
    'Button | screenshots views and disabled',
    screenshotTesting({
        cases: viewsDisabledCases,
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe(
    'Button | screenshots views and block',
    screenshotTesting({
        cases: viewsBlockCases,
        it,
        beforeAll,
        afterAll,
        expect,
    }),
);

/**
 * Скриншот для этого теста получается не информативным,
 * так как в самом начале анимации не видно лоадер.
 * Для того, чтобы скриншот был информативным, необходимо на сервере подождать какое-то время,
 * чтобы появился лоадер, а потом уже делать скриншот.
 */
describe(
    'Button | screenshots views and loading',
    screenshotTesting({
        cases: viewsLoadingCases,
        it,
        beforeAll,
        afterAll,
        expect,
        matchImageSnapshotOptions: {
            failureThresholdType: 'pixel',
            failureThreshold: 5,
        },
        screenshotOpts: { clip },
    }),
);
