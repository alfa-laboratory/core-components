import { Page } from 'playwright';
import {
    setupScreenshotTesting,
    customSnapshotIdentifier,
    generateTestCases,
    createSpriteStorybookUrl,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 200, height: 100 };

describe(
    'CustomButton | contentColors & sizes',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'CustomButton',
                    size: { width: 200, height: 80 },
                    knobs: {
                        children: 'Оплатить',
                        contentColor: ['white', 'black'],
                        size: ['xxs', 'xs', 's', 'm', 'l', 'xl'],
                    },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'CustomButton | backgroundColors & sizes',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'CustomButton',
                    size: { width: 200, height: 80 },
                    knobs: {
                        children: 'Оплатить',
                        backgroundColor: ['rgba(154, 6, 191, 1)', 'rgba(74, 242, 253, 1)'],
                        size: ['xxs', 'xs', 's', 'm', 'l', 'xl'],
                    },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe('CustomButton | colors and themes', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    `${theme} theme`,
                    createSpriteStorybookUrl({
                        componentName: 'CustomButton',
                        knobs: {
                            children: 'Оплатить',
                            disabled: [false, true],
                            backgroundColor: ['rgba(154, 6, 191, 1)', 'rgba(74, 242, 253, 1)'],
                            contentColor: ['white', 'black'],
                        },
                        size: { width: 150, height: 80 },
                    }),
                ],
            ],
            screenshotOpts: {
                fullPage: true,
            },
            viewport: {
                width: 1100,
                height: 240,
            },
            theme,
        })();

    ['default', 'click', 'corp', 'site', 'mobile'].map(testCase);
});

describe(
    'CustomButton | colors and block',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'CustomButton',
                    size: { width: 500, height: 80 },
                    knobs: {
                        children: 'Оплатить',
                        block: true,
                        backgroundColor: ['rgba(154, 6, 191, 1)', 'rgba(74, 242, 253, 1)'],
                        contentColor: ['white', 'black'],
                    },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'CustomButton | colors and loading',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'CustomButton',
            knobs: {
                children: 'Оплатить',
                loading: true,
                backgroundColor: ['rgba(154, 6, 191, 1)', 'rgba(74, 242, 253, 1)'],
                contentColor: ['white', 'black'],
            },
        }),
        evaluate: (page: Page) => page.waitForTimeout(300),
        matchImageSnapshotOptions: {
            failureThresholdType: 'percent',
            failureThreshold: 0.1,
        },
        screenshotOpts: { clip },
    }),
);

describe(
    'CustomButton | screenshots hover state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'CustomButton',
            knobs: {
                children: 'Оплатить',
                backgroundColor: ['rgba(154, 6, 191, 1)', 'rgba(74, 242, 253, 1)'],
                contentColor: ['white', 'black'],
            },
        }),
        screenshotOpts: { clip },
        evaluate: (page: Page) => page.hover('button').then(() => page.waitForTimeout(500)),
        matchImageSnapshotOptions: {
            customSnapshotIdentifier: (...args) => `hover-${customSnapshotIdentifier(...args)}`,
        },
    }),
);

describe(
    'CustomButton | screenshots pressed state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'CustomButton',
            knobs: {
                children: 'Оплатить',
                backgroundColor: ['rgba(154, 6, 191, 1)', 'rgba(74, 242, 253, 1)'],
                contentColor: ['white', 'black'],
            },
        }),
        screenshotOpts: { clip },
        evaluate: (page: Page) => {
            return page.mouse
                .move(30, 30)
                .then(() => page.mouse.down().then(() => page.waitForTimeout(500)));
        },
        matchImageSnapshotOptions: {
            customSnapshotIdentifier: (...args) => `hover-${customSnapshotIdentifier(...args)}`,
        },
    }),
);
