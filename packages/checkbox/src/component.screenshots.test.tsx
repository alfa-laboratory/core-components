import {
    setupScreenshotTesting,
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
    createSpriteStorybookUrl,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 400, height: 100 };

describe(
    'Checkbox | size, disabled, align',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Checkbox',
                    knobs: {
                        label: ['Согласен с условиями'],
                        hint: ['Дополнительная информация'],
                        size: ['s', 'm'],
                        disabled: [true, false],
                        indeterminate: [true, false],
                        align: ['start', 'center'],
                    },
                    size: { width: 400, height: 100 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'Checkbox | addons, block',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Checkbox',
                    knobs: {
                        label: ['Согласен с условиями'],
                        hint: ['Дополнительная информация'],
                        size: ['s'],
                        addons: ['', 'Addons'],
                        block: [true, false],
                    },
                    size: { width: 400, height: 100 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe('Checkbox | interactions tests', () => {
    test('Check checkbox', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Checkbox',
            knobs: {
                label: 'Согласен с условиями',
                size: 's',
            },
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.click('label');

            await matchHtml({ page, expect, css, screenshotOpts: { clip } });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
