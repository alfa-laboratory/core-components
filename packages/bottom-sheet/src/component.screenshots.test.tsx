import {
    setupScreenshotTesting,
    createSpriteStorybookUrl,
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

describe(
    'BottomSheet',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'BottomSheet',
                    size: { width: 350, height: 350 },
                    knobs: {
                        open: true,
                        title: 'Заголовок',
                        children: 'Контент',
                    },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe('BottomSheet | interactions tests', () => {
    test('Open sheet', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'BottomSheet',
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.click('#button-1');

            await matchHtml({
                page,
                expect,
                css,
                screenshotOpts: { fullPage: true },
            });

            await page.reload();

            await page.click('#button-2');

            await matchHtml({
                page,
                expect,
                css,
                screenshotOpts: { fullPage: true },
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
