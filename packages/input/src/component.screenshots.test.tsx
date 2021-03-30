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
    'Input | screenshots main props',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Input',
            knobs: {
                label: 'Label',
                size: ['s', 'm', 'l'],
                block: [false, true],
                disabled: [false, true],
            },
        }),
    }),
);

describe(
    'Input | screenshots hint and error',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Input',
            knobs: {
                size: 'm',
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
                rightAddons: ['right', false],
                leftAddons: ['left', false],
                bottomAddons: ['bottom', false],
                success: [false, true],
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
