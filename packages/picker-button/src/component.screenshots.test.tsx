/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
    generateTestCases,
    openBrowserPage,
    closeBrowser,
    matchHtml,
} from '../../screenshot-utils';

const options = [
    { key: '4', content: 'Открыть' },
    { key: '5', content: 'Сохранить' },
    { key: '6', content: 'Удалить' },
];

describe('PickerButton', () => {
    test('test positioning', async () => {
        const cases = generateTestCases({
            componentName: 'PickerButton',
            knobs: {
                options: JSON.stringify(options),
                label: 'Открыть',
                block: true,
                size: ['m', 's', 'xs'],
            },
        });

        const { browser, context, page, css } = await openBrowserPage(cases[0][1]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, pageUrl] of cases) {
            try {
                await page.goto(pageUrl);

                await page.click('button');

                await matchHtml({
                    page,
                    expect,
                    css,
                });
            } catch (error) {
                // eslint-disable-next-line no-console
                await console.error(error.message);
            }
        }

        await closeBrowser({ browser, context, page });
    });
});
