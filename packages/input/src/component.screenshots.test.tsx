import {
    screenshotTesting,
    getComponentScreenshotTestCases,
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../utils';

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

const clip = { x: 0, y: 0, width: 350, height: 150 };

describe(
    'Input | screenshots sizes, blocks and disabled',
    screenshotTesting({ cases: sizesBlockDisabledCases, it, beforeAll, afterAll, expect }),
);

describe(
    'Input | screenshots size, placeholder and label',
    screenshotTesting({
        cases: sizesPlaceholderLabelCases,
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe(
    'Input | screenshots size, hint and error',
    screenshotTesting({
        cases: sizesHintErrorCases,
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe(
    'Input | screenshots addons',
    screenshotTesting({
        cases: addonsCases,
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe('Input | interactions tests', () => {
    test('Fill input value', async () => {
        const pageUrl = createStorybookUrl({ componentName: 'input' });
        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.fill('input', 'value');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
