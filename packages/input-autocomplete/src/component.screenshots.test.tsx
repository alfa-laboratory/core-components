import {
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

describe('InputAutocomplete | interactions tests', () => {
    test('Fill value', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'InputAutocomplete',
            testStory: false,
            knobs: {
                block: true,
            },
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await matchHtml({ page, expect, css });

            await page.focus('input');

            await matchHtml({ page, expect, css });

            await page.fill('input', 'D');

            await matchHtml({ page, expect, css });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
