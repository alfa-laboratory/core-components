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

describe('Modal | ModalMobile', () => {
    const testCase = (theme: string) => {
        const getKnobs = () => {
            if (theme === 'click') {
                return {
                    open: true,
                    header: [true, false],
                    'header.title': 'Заголовок',
                    'header.hasCloser': [false, true],
                    footer: [false, true],
                };
            }

            return {
                open: true,
                header: [true, false],
                'header.title': '',
                'header.hasCloser': true,
                footer: [false, true],
            };
        };

        return screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                subComponentName: 'ModalMobile',
                testStory: false,
                knobs: getKnobs(),
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
    };

    ['default', 'click'].map(testCase);
});

describe('Modal | ModalDesktop', () => {
    const testCase = (theme: string) => {
        const getKnobs = () => {
            if (theme === 'click') {
                return {
                    open: true,
                    header: [true, false],
                    'header.title': 'Заголовок',
                    'header.hasCloser': [false, true],
                    footer: [false, true],
                    fullscreen: [false, true],
                };
            }

            return {
                open: true,
                header: false,
                'header.title': '',
                'header.hasCloser': [false, true],
                footer: [false, true],
                fullscreen: [false, true],
            };
        };

        return screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                subComponentName: 'ModalDesktop',
                testStory: false,
                knobs: getKnobs(),
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
    };

    ['default', 'click'].map(testCase);
});

describe('Modal | ModalDesktop sizes', () => {
    const testCase = (theme: string) => {
        return screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                subComponentName: 'ModalDesktop',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    size: ['s', 'm', 'l'],
                },
            }),
            viewport: {
                width: 960,
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
    };

    ['default', 'click'].map(testCase);
});

describe('Modal | Footer layout', () => {
    const testCase = (theme: string) => {
        return screenshotTesting({
            cases: [
                ...generateTestCases({
                    componentName: 'Modal',
                    subComponentName: 'ModalDesktop',
                    testStory: false,
                    knobs: {
                        open: true,
                        header: false,
                        footer: true,
                    },
                }),
                ...generateTestCases({
                    componentName: 'Modal',
                    subComponentName: 'ModalDesktop',
                    testStory: false,
                    knobs: {
                        open: true,
                        header: false,
                        footer: true,
                        'footer.gap': [16, 24, 32],
                    },
                }),
                ...generateTestCases({
                    componentName: 'Modal',
                    subComponentName: 'ModalDesktop',
                    testStory: false,
                    knobs: {
                        open: true,
                        header: false,
                        footer: true,
                        'footer.layout': ['start', 'center', 'space-between', 'column'],
                    },
                }),
            ],
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
    };

    ['default', 'click'].map(testCase);
});
