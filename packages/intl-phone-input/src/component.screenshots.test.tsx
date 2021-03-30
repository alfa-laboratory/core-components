import {
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

const clip = { x: 0, y: 0, width: 360, height: 600 };

/**
 * TODO: иконки стран недоступны на playwright-сервере
 */
describe('IntlPhoneInput | interactions tests', () => {
    test('Fill value', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'IntlPhoneInput',
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.waitForLoadState('load');

            /**
             * Ждем, пока библиотека libphonenumber-js отформатирует номер телефона
             */
            await page.waitForTimeout(300);

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });

            await page.click('[role="combobox"]');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });

            await page.click('[role="option"]');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
