import {
    setupScreenshotTesting,
    createStorybookUrl,
    closeBrowser,
    matchHtml,
    openBrowserPage,
    createSpriteStorybookUrl,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const options = [
    { key: '1', content: 'Neptunium' },
    { key: '2', content: 'Plutonium' },
    { key: '3', content: 'Americium' },
    { key: '4', content: 'Curium' },
    { key: '5', content: 'Berkelium' },
    { key: '6', content: 'Californium' },
];

describe('Select', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    `${theme} theme — main props`,
                    createSpriteStorybookUrl({
                        componentName: 'Select',
                        knobs: {
                            options: [[]],
                            block: true,
                            placeholder: 'Выберите элемент',
                            size: ['s', 'm', 'l'],
                            label: ['Элемент', ''],
                        },
                        size: { width: 300, height: 120 },
                    }),
                ],
                [
                    `${theme} theme - additional props`,
                    createSpriteStorybookUrl({
                        componentName: 'Select',
                        knobs: {
                            options: [[]],
                            block: true,
                            Arrow: [false, undefined],
                            placeholder: 'Выберите элемент',
                            label: ['Элемент', ''],
                            hint: 'Hint',
                            error: ['', 'Error'],
                            disabled: [false, true],
                        },
                        size: { width: 300, height: 120 },
                    }),
                ],
            ],
            screenshotOpts: {
                fullPage: true,
            },
            viewport: {
                width: 700,
                height: 100,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
});

describe.only(
    'Select',
    screenshotTesting({
        cases: [
            [
                'placeholder + label',
                createSpriteStorybookUrl({
                    componentName: 'Select',
                    knobs: {
                        options: JSON.stringify(options.slice(0, 1)),
                        selected: [undefined, options[0].key],
                        placeholder: ['', 'Выберите элемент'],
                        label: ['', 'Элемент'],
                    },
                    size: { width: 300, height: 120 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
        viewport: {
            width: 700,
            height: 100,
        },
    }),
);

describe('Select | interactions tests', () => {
    const testCase = async (theme: string) =>
        test(`${theme} - open select, select one item`, async () => {
            const pageUrl = createStorybookUrl({
                componentName: 'Select',
                knobs: {
                    block: true,
                    label: 'Элемент',
                    placeholder: 'Выберите элемент',
                    options: JSON.stringify(options),
                },
            });
            const { browser, context, page, css } = await openBrowserPage(pageUrl);

            const viewport = { width: 260, height: 768 };

            await page.setViewportSize(viewport);

            const match = async () => matchHtml({ page, expect, css, theme, viewport });

            try {
                await match();

                await page.click('[role="combobox"]');

                await match();

                await page.click('[role="option"]');

                await match();

                await page.click('[role="combobox"]');

                await match();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error.message);
            } finally {
                await closeBrowser({ browser, context, page });
            }
        });

    ['default', 'click'].map(testCase);

    test('Visible options', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Select',
            knobs: {
                block: true,
                label: 'Элемент',
                placeholder: 'Выберите элемент',
                visibleOptions: 3,
                options: JSON.stringify(options),
            },
        });
        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        const viewport = { width: 260, height: 768 };

        await page.setViewportSize(viewport);

        try {
            await page.click('[role="combobox"]');

            await matchHtml({ page, expect, css, viewport });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });

    test('Long options', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Select',
            knobs: {
                block: true,
                label: 'Элемент',
                placeholder: 'Выберите элемент',
                optionsListWidth: 'field',
                options: JSON.stringify([
                    { key: '1', content: 'ВеликийНовгород' },
                    { key: '2', content: 'ГусьХрустальный' },
                    { key: '3', content: 'КаменскШахтинский' },
                    { key: '4', content: 'ОченьДлинноеНазвание' },
                ]),
            },
        });
        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        const viewport = { width: 200, height: 768 };

        await page.setViewportSize(viewport);

        try {
            await page.click('[role="combobox"]');

            await matchHtml({ page, expect, css, viewport });

            await page.click('[role="option"]');

            await page.click('[role="combobox"]');

            await matchHtml({ page, expect, css, viewport });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
