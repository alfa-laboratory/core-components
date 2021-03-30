import {
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

const clip = { x: 0, y: 0, width: 1920, height: 200 };

describe('Collapse | interactions tests', () => {
    test('Collapse component', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Collapse',
            knobs: {},
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await matchHtml({ page, expect, css, screenshotOpts: { clip } });

            await page.click('a');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
