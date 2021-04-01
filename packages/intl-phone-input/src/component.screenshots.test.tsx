import {
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

/**
 * TODO: иконки стран недоступны на playwright-сервере
 */
describe('IntlPhoneInput | interactions tests', () => {
    test('Fill value', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'IntlPhoneInput',
            testStory: false,
            knobs: {
                block: true,
            },
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.waitForLoadState('networkidle');

            /**
             * Ждем, пока библиотека libphonenumber-js отформатирует номер телефона
             */
            await page.waitForTimeout(500);

            await matchHtml({ page, expect, css });

            await page.click('[role="combobox"]');

            await matchHtml({ page, expect, css });

            await page.click('[role="option"]');

            await matchHtml({ page, expect, css });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
