import {
    setupScreenshotTesting,
    customSnapshotIdentifier,
    generateTestCases,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe.skip('Modal | ModalMobile', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                subComponentName: 'ModalMobile',
                testStory: false,
                knobs: {
                    open: true,
                    'header.children': ['', 'Заголовок'],
                    'header.hasCloser': [false, true],
                    footer: [false, true],
                },
            }),
            viewport: {
                width: 700,
                height: 700,
            },
            screenshotOpts: {
                fullPage: true,
            },
            matchImageSnapshotOptions: {
                customSnapshotIdentifier: (...args) =>
                    `${theme}-${customSnapshotIdentifier(...args)}`,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
});

describe('Modal | ModalDesktop', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                subComponentName: 'ModalDesktop',
                testStory: false,
                knobs: {
                    open: true,
                    'header.children': ['', 'Заголовок'],
                    'header.hasCloser': [false, true],
                    footer: [false, true],
                    fullscreen: [false, true],
                },
            }),
            viewport: {
                width: 700,
                height: 700,
            },
            screenshotOpts: {
                fullPage: true,
            },
            matchImageSnapshotOptions: {
                customSnapshotIdentifier: (...args) =>
                    `${theme}-${customSnapshotIdentifier(...args)}`,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
});
