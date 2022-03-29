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

describe('FilterTag | main props', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    theme,
                    createSpriteStorybookUrl({
                        componentName: 'FilterTag',
                        knobs: {
                            children: 'Фильтр',
                            size: ['xxs', 'xs', 's'],
                            checked: [false, true],
                            disabled: [false, true],
                            open: [false, true],
                            variant: ['default', 'alt'],
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
    'FilerTag | screenshots hover state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'FilterTag',
            knobs: {
                children: 'Фильтр',
                size: 's',
                checked: true,
                disabled: false,
            },
        }),
        screenshotOpts: { clip },
        evaluate: (page: Page) => {
            return page.mouse.move(20, 30).then(() => page.waitForTimeout(500));
        },
        matchImageSnapshotOptions: {
            customSnapshotIdentifier: (...args) => `hover-${customSnapshotIdentifier(...args)}`,
        },
    }),
);

describe(
    'FilerTag | screenshots hover clear state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'FilterTag',
            knobs: {
                children: 'Фильтр',
                size: 's',
                checked: true,
                disabled: false,
            },
        }),
        screenshotOpts: { clip },
        evaluate: (page: Page) => {
            return page.mouse.move(140, 30).then(() => page.waitForTimeout(500));
        },
        matchImageSnapshotOptions: {
            customSnapshotIdentifier: (...args) => `hover-${customSnapshotIdentifier(...args)}`,
        },
    }),
);

describe(
    'FilerTag | screenshots pressed state',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'FilterTag',
            knobs: {
                children: 'Фильтр',
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
