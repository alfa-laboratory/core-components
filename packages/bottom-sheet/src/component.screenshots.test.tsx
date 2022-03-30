import {
    setupScreenshotTesting,
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
                'title-align-left',
                createStorybookUrl({
                    componentName: 'BottomSheet',
                    knobs: {
                        open: true,
                        title: 'Заголовок',
                        children: 'Контент',
                        titleAlign: 'left',
                    },
                }),
            ],
            [
                'no-title',
                createStorybookUrl({
                    componentName: 'BottomSheet',
                    knobs: {
                        open: true,
                        children: 'Контент',
                        hasCloser: true,
                        hasBacker: true,
                    },
                }),
            ],
            [
                'full-header-small-height',
                createStorybookUrl({
                    componentName: 'BottomSheet',
                    knobs: {
                        open: true,
                        children: 'Контент',
                        titleAlign: 'center',
                        title: 'Заголовок',
                        hasCloser: true,
                        hasBacker: true,
                    },
                }),
            ],
            [
                'full-header-full-height',
                createStorybookUrl({
                    componentName: 'BottomSheet',
                    knobs: {
                        open: true,
                        children: 'Контент',
                        titleAlign: 'center',
                        title: 'Заголовок',
                        hasCloser: true,
                        hasBacker: true,
                        initialHeight: 'full',
                    },
                }),
            ],
            [
                'left-title-with-closer',
                createStorybookUrl({
                    componentName: 'BottomSheet',
                    knobs: {
                        open: true,
                        children: 'Контент',
                        titleAlign: 'left',
                        title: 'Заголовок',
                        hasCloser: true,
                    },
                }),
            ],
            [
                'no-header-no-footer',
                createStorybookUrl({
                    componentName: 'BottomSheet',
                    knobs: {
                        open: true,
                        children: 'Контент',
                        hideHeader: true,
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
