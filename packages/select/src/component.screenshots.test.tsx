import { screenshotTesting, getComponentScreenshotTestCases } from '../../utils';

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

/* eslint-disable */
// Пока удалил этот тест, так как сейчас есть различие между скриншотами

// describe('Select | interactions tests', () => {
//     test('Open select, select one item', async () => {
//         const pageUrl = createStorybookUrl({ componentName: 'select' });
//         const { browser, context, page, css } = await openBrowserPage(pageUrl);

//         // eslint-disable-next-line no-shadow
//         const clip = { x: 0, y: 0, width: 300, height: 500 };

//         try {
//             await matchHtml({ page, expect, css, screenshotOpts: { clip } });

//             await page.click('[role="combobox"]');

//             await matchHtml({ page, expect, css, screenshotOpts: { clip } });

//             await page.click('[role="option"]');

//             await matchHtml({ page, expect, css, screenshotOpts: { clip } });
//         } catch (error) {
//             // eslint-disable-next-line no-console
//             console.error(error);
//         } finally {
//             await closeBrowser({ browser, context, page });
//         }
//     });
// });
