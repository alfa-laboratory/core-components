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
                            size: ['xl', 'l', 'm', 's', 'xs'],
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

    ['default', 'click'].map(testCase);
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

    ['default', 'click'].map(testCase);
});
