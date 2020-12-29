import { screenshotTesting, getComponentScreenshotTestCases } from '../../utils';

const sizesBlockDisabledCases = getComponentScreenshotTestCases({
    componentName: 'input',
    knobs: {
        size: ['s', 'm', 'l'],
        block: [false, true],
        disabled: [false, true],
    },
});

const sizesPlaceholderLabelCases = getComponentScreenshotTestCases({
    componentName: 'input',
    knobs: {
        size: ['s', 'm', 'l'],
        placeholder: ['', 'Placeholder'],
        label: ['', 'Label'],
        success: [true, false],
    },
});

const sizesHintErrorCases = getComponentScreenshotTestCases({
    componentName: 'input',
    knobs: {
        size: ['s', 'm', 'l'],
        hint: ['', 'Hint'],
        error: ['', 'Error'],
    },
});

const addonsCases = getComponentScreenshotTestCases({
    componentName: 'input',
    knobs: {
        rightAddons: [true, false],
        leftAddons: [true, false],
        bottomAddons: [true, false],
    },
});

describe(
    'Button | screenshots sizes, blocks and disabled',
    screenshotTesting(sizesBlockDisabledCases, it, beforeAll, afterAll, expect),
);

describe(
    'Button | screenshots size, placeholder and label',
    screenshotTesting(sizesPlaceholderLabelCases, it, beforeAll, afterAll, expect),
);

describe(
    'Button | screenshots size, hint and error',
    screenshotTesting(sizesHintErrorCases, it, beforeAll, afterAll, expect),
);

describe(
    'Button | screenshots addons',
    screenshotTesting(addonsCases, it, beforeAll, afterAll, expect),
);
