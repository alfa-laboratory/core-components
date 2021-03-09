import {
    screenshotTesting,
    getComponentScreenshotTestCases,
    createStorybookUrl,
    closeBrowser,
    matchHtml,
    openBrowserPage,
} from '../../utils';

const sizesBlockDisabledCases = getComponentScreenshotTestCases({
    componentName: 'select',
    knobs: {
        size: ['s', 'm', 'l'],
        block: [true, false],
        disabled: [true, false],
    },
});

const placeholderLabelCases = getComponentScreenshotTestCases({
    componentName: 'select',
    knobs: {
        placeholder: ['Placeholder', ''],
        label: ['Label', ''],
    },
});

const hintErrorArrowCases = getComponentScreenshotTestCases({
    componentName: 'select',
    knobs: {
        hint: ['Hint', ''],
        error: ['Error', ''],
        Arrow: [true, false],
    },
});

const clip = { x: 0, y: 0, width: 300, height: 100 };

describe(
    'Select | screenshots sizes, block and disabled',
    screenshotTesting({ cases: sizesBlockDisabledCases, it, beforeAll, afterAll, expect }),
);

describe(
    'Select | screenshots placeholder and label',
    screenshotTesting({
        cases: placeholderLabelCases,
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe(
    'Select | screenshots hint, error and Arrow',
    screenshotTesting({
        cases: hintErrorArrowCases,
        it,
        beforeAll,
        afterAll,
        expect,
        screenshotOpts: { clip },
    }),
);

describe('Select | interactions tests', () => {
    test('Open select, select one item', async () => {
        const pageUrl = createStorybookUrl({ componentName: 'select', knobs: { block: true } });
        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await matchHtml({ page, expect, css });

            await page.click('[role="combobox"]');

            await matchHtml({ page, expect, css });

            await page.click('[role="option"]');

            await matchHtml({ page, expect, css });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
