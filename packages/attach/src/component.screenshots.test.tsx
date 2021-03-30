import {
    setupScreenshotTesting,
    generateTestCases,
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 400, height: 100 };

describe(
    'Attach | screenshots',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Attach',
            knobs: {
                buttonContent: 'Выберите файл',
                noFileText: 'Нет файла',
                size: ['xs', 's', 'm', 'l'],
            },
        }),
        screenshotOpts: { clip },
    }),
);

describe('Attach | interactions tests', () => {
    test('Attach file', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Attach',
            knobs: {
                buttonContent: 'Выберите файл',
                size: 'l',
                progressBarPercent: 75,
            },
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            const [fileChooser] = await Promise.all([
                page.waitForEvent('filechooser'),
                page.click('button'),
            ]);

            await fileChooser.setFiles({
                name: 'my-file.pdf',
                buffer: Buffer.from([]),
                mimeType: 'application/pdf',
            });

            await matchHtml({ page, expect, css });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
