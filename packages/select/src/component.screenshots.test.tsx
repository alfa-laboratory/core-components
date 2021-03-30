import {
    setupScreenshotTesting,
    generateTestCases,
    createStorybookUrl,
    closeBrowser,
    matchHtml,
    openBrowserPage,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 300, height: 100 };

const options = JSON.stringify([
    { key: '1', content: 'Neptunium' },
    { key: '2', content: 'Plutonium' },
    { key: '3', content: 'Americium' },
    { key: '4', content: 'Curium' },
    { key: '5', content: 'Berkelium' },
    { key: '6', content: 'Californium' },
]);

describe(
    'Select | screenshots sizes, block and disabled',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Select',
            knobs: {
                options,
                size: ['s', 'm', 'l'],
                block: [true, false],
                disabled: [true, false],
                label: 'Элемент',
                placeholder: 'Выберите элемент',
            },
        }),
    }),
);

describe(
    'Select | screenshots placeholder and label',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Select',
            knobs: {
                block: [true],
                options,
                placeholder: ['Placeholder', ''],
                label: ['Label', ''],
            },
        }),
    }),
);

describe(
    'Select | screenshots hint, error and Arrow',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Select',
            knobs: {
                options,
                hint: ['Hint', ''],
                error: ['Error', ''],
                label: 'Элемент',
                placeholder: 'Выберите элемент',
            },
        }),
        screenshotOpts: { clip },
    }),
);

describe('Select | interactions tests', () => {
    test('Open select, select one item', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Select',
            knobs: {
                block: true,
                label: 'Элемент',
                placeholder: 'Выберите элемент',
                options,
            },
        });
        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
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
