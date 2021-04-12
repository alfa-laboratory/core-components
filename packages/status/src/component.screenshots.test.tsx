import { generateTestCases, setupScreenshotTesting } from '../../screenshot-utils';

import { colors } from './Component';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 70, height: 35 };

describe(
    'Status | screenshots views and colors',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Status',
            knobs: {
                children: 'Label',
                view: ['soft', 'contrast'],
                color: [...colors],
            },
        }),
        screenshotOpts: { clip },
    }),
);
