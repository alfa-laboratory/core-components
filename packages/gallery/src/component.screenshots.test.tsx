import {
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

describe('Gallery | interactions tests', () => {
    test('Open gallery', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Gallery',
            knobs: {
                images: [],
            },
            // testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.click('#open-gallery-button');

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
