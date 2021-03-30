import {
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

const clip = { x: 0, y: 0, width: 360, height: 600 };

describe('InputAutocomplete | interactions tests', () => {
    test('Fill value', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'InputAutocomplete',
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await matchHtml({ page, expect, css, screenshotOpts: { clip } });

            await page.focus('input');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });

            await page.fill('input', 'D');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
