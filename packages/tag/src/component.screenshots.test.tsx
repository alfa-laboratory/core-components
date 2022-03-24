import { Page } from 'playwright';
import {
    setupScreenshotTesting,
    createSpriteStorybookUrl,
    generateTestCases,
    customSnapshotIdentifier,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const availableThemes = ['default', 'click', 'mobile'];

const clip = { x: 0, y: 0, width: 200, height: 100 };

describe('Tag | main props', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    theme,
                    createSpriteStorybookUrl({
                        componentName: 'Tag',
                        knobs: {
                            children: 'Оплатить',
                            size: ['xxs', 'xs', 's', 'm', 'l', 'xl'],
                            checked: [false, true],
                            disabled: [false, true],
                        },
                        size: { width: 160, height: 90 },
                    }),
                ],
            ],
            screenshotOpts: {
                fullPage: true,
            },
            viewport: { width: 740, height: 100 },
            theme,
        })();

    availableThemes.map(testCase);
});

describe('Tag | right addons', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: generateTestCases({
                componentName: 'Tag',
                testStory: false,
                knobs: {
                    rightAddons: true,
                    checked: [false, true],
                    disabled: [false, true],
                },
            }),
            screenshotOpts: {
                fullPage: true,
            },
            matchImageSnapshotOptions: {
                customSnapshotIdentifier: (...args) =>
                    `${theme}-${customSnapshotIdentifier(...args)}`,
            },
            viewport: { width: 180, height: 80 },
            theme,
        })();

    availableThemes.map(testCase);
});

describe('Tag | inverted', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    theme,
                    createSpriteStorybookUrl({
                        componentName: 'Tag',
                        knobs: {
                            children: 'Оплатить',
                            size: ['xxs', 'xs', 's', 'm', 'l', 'xl'],
                            checked: [false, true],
                            disabled: [false, true],
                            colors: 'inverted',
                        },
                        size: { width: 160, height: 90 },
                    }),
                ],
            ],
            screenshotOpts: {
                fullPage: true,
            },
            viewport: { width: 740, height: 100 },
            theme,
        })();

    availableThemes.map(testCase);
});

describe(
    'Tag | screenshots hover state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Tag',
            knobs: {
                children: 'Оплатить',
                size: 's',
                checked: true,
                disabled: [false, true],
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
    'Button | screenshots pressed state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Tag',
            knobs: {
                children: 'Оплатить',
                size: 's',
                checked: [true, false],
                disabled: [false, true],
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
