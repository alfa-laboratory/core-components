import { Page } from 'playwright';
import {
    setupScreenshotTesting,
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
    createSpriteStorybookUrl,
    generateTestCases,
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

describe(
    'Checkbox | hover state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Checkbox',
            knobs: {
                label: ['Согласен с условиями'],
                disabled: [true, false],
            },
        }),
        evaluate: (page: Page) => page.hover('label').then(() => page.waitForTimeout(500)),
        screenshotOpts: {
            clip,
        },
    }),
);

describe(
    'Checkbox | pressed state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Checkbox',
            knobs: {
                label: ['Согласен с условиями'],
                disabled: [true, false],
            },
        }),
        evaluate: (page: Page) => {
            return page.mouse
                .move(30, 30)
                .then(() => page.mouse.down().then(() => page.waitForTimeout(500)));
        },
        screenshotOpts: {
            clip,
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
