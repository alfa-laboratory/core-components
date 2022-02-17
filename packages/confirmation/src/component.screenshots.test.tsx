import { Page } from 'playwright';
import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

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
                    size: { width: 450, height: 450 },
                    knobs: {
                        screen: 'INITIAL',
                        state: 'INITIAL',
                        alignContent: ['left', 'center'],
                        requiredCharAmount: [5, 7],
                        phone: '+7 ··· ··· 07-24',
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
    'Confirmation | CODE_CHECKING, CODE_SENDING, CODE_ERROR states',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Confirmation',
                    size: { width: 450, height: 450 },
                    knobs: {
                        screen: ['INITIAL'],
                        state: ['INITIAL', 'CODE_CHECKING', 'CODE_SENDING', 'CODE_ERROR'],
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
    'Confirmation | HINT, FATAL_ERROR, TEMP_BLOCK screens',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'Confirmation',
                    size: { width: 450, height: 450 },
                    knobs: {
                        screen: ['HINT', 'FATAL_ERROR', 'TEMP_BLOCK'],
                        state: ['INITIAL'],
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
                    size: { width: 450, height: 450 },
                    knobs: {
                        screen: 'INITIAL',
                        state: 'INITIAL',
                        blockSmsRetry: true,
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
