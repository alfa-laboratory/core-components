import { chromium } from 'playwright';

import {
    screenshotTesting,
    getComponentScreenshotTestCases,
    createStorybookUrl,
    matchHtml,
    closeBrowser,
    openBrowser,
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

describe(
    'Select | screenshots sizes, block and disabled',
    screenshotTesting(sizesBlockDisabledCases, it, beforeAll, afterAll, expect),
);

describe(
    'Select | screenshots placeholder and label',
    screenshotTesting(placeholderLabelCases, it, beforeAll, afterAll, expect),
);

describe(
    'Select | screenshots hint, error and Arrow',
    screenshotTesting(hintErrorArrowCases, it, beforeAll, afterAll, expect),
);

describe('Select | interactions tests', () => {
    test('Open select, select one item', async () => {
        const pageUrl = createStorybookUrl({ componentName: 'select' });
        const { browser, context, page, css } = await openBrowser(chromium, pageUrl);

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
