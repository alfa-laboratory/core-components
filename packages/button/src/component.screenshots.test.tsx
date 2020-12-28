import { screenshotTesting, getComponentScreenshotTestCases } from '../../utils';

const cases = getComponentScreenshotTestCases({
    name: 'button',
    knobs: {
        view: ['primary', 'secondary', 'outlined', 'filled', 'link', 'ghost'],
        size: ['xs', 's', 'm', 'l'],
        block: [true, false],
        loading: [true, false],
    },
});

describe('Button | screenshots', screenshotTesting(cases, it, beforeAll, afterAll, expect));
