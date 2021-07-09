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
                    'header.title': 'Заголовок',
                    'header.hasCloser': [false, true],
                };
            }

            return {
                'header.title': '',
                'header.hasCloser': true,
            };
        };

        return screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    ...getKnobs(),
                    open: true,
                    header: [true, false],
                    footer: [false, true],
                    ModalComponent: 'ModalMobile',
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
    };

    ['default', 'click'].map(testCase);
});

describe('Modal | ModalDesktop', () => {
    const testCase = (theme: string) => {
        const getKnobs = () => {
            if (theme === 'click') {
                return {
                    header: [true, false],
                    'header.title': 'Заголовок',
                };
            }

            return {
                header: false,
                'header.title': '',
            };
        };

        return screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    ...getKnobs(),
                    open: true,
                    footer: [false, true],
                    fullscreen: [false, true],
                    'header.hasCloser': [false, true],
                    ModalComponent: 'ModalDesktop',
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
    };

    ['default', 'click'].map(testCase);
});

describe('Modal | ModalDesktop sizes', () => {
    const testCase = (theme: string) => {
        return screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    size: ['s', 'm', 'l'],
                    ModalComponent: 'ModalDesktop',
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
                    testStory: false,
                    knobs: {
                        ModalComponent: 'ModalDesktop',
                        open: true,
                        header: false,
                        footer: true,
                    },
                }),
                ...generateTestCases({
                    componentName: 'Modal',
                    testStory: false,
                    knobs: {
                        ModalComponent: 'ModalDesktop',
                        open: true,
                        header: false,
                        footer: true,
                        'footer.gap': [16, 24, 32],
                    },
                }),
                ...generateTestCases({
                    componentName: 'Modal',
                    testStory: false,
                    knobs: {
                        ModalComponent: 'ModalDesktop',
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
