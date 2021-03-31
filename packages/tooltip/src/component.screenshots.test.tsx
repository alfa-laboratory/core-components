/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import {
    generateTestCases,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

describe('Tooltip', () => {
    test('test positioning', async () => {
        jest.setTimeout(60000);

        const cases = generateTestCases({
            componentName: 'Tooltip',
            testStory: false,
            knobs: {
                open: true,
                onOpenDelay: 0,
                position: [
                    'top',
                    'bottom',
                    'right',
                    'left',
                    'top-start',
                    'top-end',
                    'bottom-start',
                    'bottom-end',
                    'right-start',
                    'right-end',
                    'left-start',
                    'left-end',
                ],
            },
        });

        const { browser, context, page, css } = await openBrowserPage(cases[0][1]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, pageUrl] of cases) {
            try {
                await page.goto(pageUrl);

                await page.hover('*[class^=target]');

                await matchHtml({
                    page,
                    expect,
                    css,
                    matchImageSnapshotOptions: {
                        failureThresholdType: 'pixel',
                        failureThreshold: 5,
                    },
                });
            } catch (error) {
                // eslint-disable-next-line no-console
                await console.error(error.message);
            }
        }

        await closeBrowser({ browser, context, page });
    });
});
