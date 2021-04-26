import { Page } from 'playwright';
import {
    setupScreenshotTesting,
    createSpriteStorybookUrl,
    createStorybookUrl,
    openBrowserPage,
    matchHtml,
    closeBrowser,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe(
    'Confirmation | code, charAmount, align',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Confirmation',
                    size: { width: 350, height: 350 },
                    knobs: {
                        code: ['', '1234'],
                        alignContent: ['left', 'center'],
                        requiredCharAmount: [3, 5],
                    },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
        matchImageSnapshotOptions: {
            failureThresholdType: 'percent',
            failureThreshold: 0.0005,
        },
    }),
);

describe(
    'Confirmation | phone, phoneMask, countdown',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Confirmation',
                    size: { width: 350, height: 350 },
                    knobs: {
                        code: ['12345'],
                        phone: '+7 000 000 00 42',
                        hasPhoneMask: [true, false],
                        hasSmsCountdown: [true, false],
                    },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
        matchImageSnapshotOptions: {
            failureThresholdType: 'percent',
            failureThreshold: 0.0005,
        },
    }),
);

describe(
    'Confirmation | codeChecking, codeSending',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Confirmation',
                    size: { width: 350, height: 350 },
                    knobs: {
                        code: ['12345'],
                        codeChecking: [true, false],
                        codeSending: [true, false],
                    },
                }),
            ],
        ],
        evaluate: (page: Page) => page.waitForTimeout(300),
        screenshotOpts: {
            fullPage: true,
        },
        matchImageSnapshotOptions: {
            failureThresholdType: 'percent',
            failureThreshold: 0.005,
        },
    }),
);

describe(
    'Confirmation | sign error',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Confirmation',
                    size: { width: 350, height: 350 },
                    knobs: {
                        code: ['12345'],
                        error: true,
                        errorText: 'Неправильный код',
                        errorIsFatal: [true, false],
                    },
                }),
            ],
        ],
        evaluate: (page: Page) => page.waitForTimeout(300),
        screenshotOpts: {
            fullPage: true,
        },
        matchImageSnapshotOptions: {
            failureThresholdType: 'percent',
            failureThreshold: 0.005,
        },
    }),
);

describe(
    'Confirmation | noAttemptsLeftMessage',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Confirmation',
                    size: { width: 350, height: 350 },
                    knobs: {
                        code: ['12345'],
                        error: true,
                        errorText: 'Неправильный код',
                        noAttemptsLeftMessage: ['', 'Не осталось попыток запроса кода'],
                    },
                }),
            ],
        ],
        evaluate: (page: Page) => page.waitForTimeout(300),
        screenshotOpts: {
            fullPage: true,
        },
        matchImageSnapshotOptions: {
            failureThresholdType: 'percent',
            failureThreshold: 0.005,
        },
    }),
);

describe('Confirmation | interactions tests', () => {
    test('Open don`t receive sms', async () => {
        const pageUrl = createStorybookUrl({
            componentName: 'Confirmation',
            testStory: false,
        });

        const { browser, context, page, css } = await openBrowserPage(pageUrl);

        try {
            await page.click('a');

            await matchHtml({
                page,
                expect,
                css,
                screenshotOpts: { clip: { x: 0, y: 60, width: 500, height: 350 } },
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error.message);
        } finally {
            await closeBrowser({ browser, context, page });
        }
    });
});
