import {
    setupScreenshotTesting,
    generateTestCases,
    createStorybookUrl,
    openBrowserPage,
    closeBrowser,
    matchHtml,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 350, height: 150 };

describe(
    'Input | screenshots sizes, blocks and disabled',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Input',
            knobs: {
                size: ['s', 'm', 'l'],
                block: [false, true],
                disabled: [false, true],
            },
        }),
    }),
);

describe(
    'Input | screenshots size, placeholder and label',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Input',
            knobs: {
                size: ['s', 'm', 'l'],
                placeholder: ['', 'Placeholder'],
                label: ['', 'Label'],
                success: [true, false],
            },
        }),
        screenshotOpts: { clip },
    }),
);

describe(
    'Input | screenshots size, hint and error',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Input',
            knobs: {
                size: ['s', 'm', 'l'],
                hint: ['', 'Hint'],
                error: ['', 'Error'],
            },
        }),
        screenshotOpts: { clip },
    }),
);

describe(
    'Input | screenshots addons',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Input',
            knobs: {
                rightAddons: [true, false],
                leftAddons: [true, false],
                bottomAddons: [true, false],
            },
        }),
        screenshotOpts: { clip },
    }),
);

describe('Input | interactions tests', () => {
    test('Fill input value', async () => {
        const pageUrl = createStorybookUrl({ componentName: 'Input' });
        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.fill('input', 'value');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
