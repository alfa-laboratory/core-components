import {
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

const VISA_VALID_NUMBER = '4111111111111111';
const MC_VALID_NUMBER = '5500000000000004';
const MIR_VALID_NUMBER = '2201382000000013';
const MAESTRO_VALID_NUMBER = '6759649826438453';

const clip = { x: 0, y: 0, width: 360, height: 240 };

describe('BankCard | interactions tests', () => {
    test('Fill value', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'BankCard',
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await matchHtml({ page, expect, css, screenshotOpts: { clip } });

            await page.fill('input', VISA_VALID_NUMBER);

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });

            await page.fill('input', MC_VALID_NUMBER);

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });

            await page.fill('input', MIR_VALID_NUMBER);

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });

            await page.fill('input', MAESTRO_VALID_NUMBER);

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
