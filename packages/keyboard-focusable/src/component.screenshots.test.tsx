import {
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

const clip = { x: 0, y: 0, width: 300, height: 100 };

describe('KeyboardFocusable | interactions tests', () => {
    test('Focus on button', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Button',
            knobs: {
                children: 'Оплатить',
                view: 'primary',
            },
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.press('#root', 'Tab');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });

    test('Focus on input', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Input',
            knobs: {
                label: 'Label',
            },
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.press('#root', 'Tab');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
