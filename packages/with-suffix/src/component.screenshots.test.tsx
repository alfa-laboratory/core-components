import { Page } from 'playwright';
import {
    closeBrowser,
    createStorybookUrl,
    matchHtml,
    openBrowserPage,
} from '../../screenshot-utils';

const clip = { x: 0, y: 0, width: 260, height: 80 };

describe('WithSuffix', () => {
    test('suffix styles', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'WithSuffix',
            testStory: false,
        }).replace('--', '-hocs--');

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await matchHtml({
                page,
                expect,
                css,
                screenshotOpts: { clip },
                evaluate: (remotePage: Page) =>
                    remotePage.focus('input').then(() => remotePage.waitForTimeout(500)),
            });
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
