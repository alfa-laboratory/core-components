import { screenshotTesting, getComponentScreenshotTestCases } from '../../utils';

import { colors } from './Component';

const viewsSizesCases = getComponentScreenshotTestCases({
    componentName: 'status',
    knobs: {
        view: ['soft', 'contrast'],
        color: [...colors],
    },
});

const clip = { x: 0, y: 0, width: 70, height: 35 };

describe(
    'Status | screenshots views and colors',
    screenshotTesting({
        cases: viewsSizesCases,
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);
