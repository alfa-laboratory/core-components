import {
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

import { TestIds } from './utils';

describe('Gallery | interactions tests', () => {
    test('With single image', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Gallery',
            knobs: {},
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.click('#open-single-gallery-button');

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

    test('With multiple images', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Gallery',
            knobs: {},
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        const nextSlide = async () => {
            await page.click(`[data-test-id=${TestIds.NEXT_SLIDE_BUTTON}]`);

            await matchHtml({
                page,
                expect,
                css,
                screenshotOpts: { fullPage: true },
            });
        };

        try {
            await page.click('#open-gallery-button');

            await matchHtml({
                page,
                expect,
                css,
                screenshotOpts: { fullPage: true },
            });

            await nextSlide();
            await nextSlide();
            await nextSlide();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });

    test('Full screen', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Gallery',
            knobs: {},
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.click('#open-gallery-button');

            await page.click(`[data-test-id=${TestIds.FULLSCREEN_BUTTON}]`);

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
