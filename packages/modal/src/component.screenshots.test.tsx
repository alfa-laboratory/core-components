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

// MOBILE
describe('ModalMobile', () => {
    const testCase = (theme: string) => {
        return screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    'header.title': 'Заголовок',
                    'header.hasCloser': true,
                    footer: true,
                    ModalComponent: 'ModalMobile',
                },
            }),
            viewport: {
                width: 320,
                height: 600,
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

describe(
    'ModalMobile | Header',
    screenshotTesting({
        cases: [
            ...generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    'header.title': 'Очень очень длинный заголовок-заголовок',
                    'header.hasCloser': [true, false],
                    ModalComponent: 'ModalMobile',
                },
            }),
            ...generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    'header.title': 'Очень очень длинный заголовок-заголовок',
                    'header.trim': [true, false],
                    ModalComponent: 'ModalMobile',
                },
            }),
            ...generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    'header.title': 'Заголовок',
                    'header.align': ['left', 'center'],
                    ModalComponent: 'ModalMobile',
                },
            }),
        ],
        viewport: {
            width: 320,
            height: 600,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'ModalMobile | Content',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Modal',
            testStory: false,
            knobs: {
                open: true,
                header: true,
                footer: true,
                'header.title': 'Заголовок',
                'content.flex': true,
                ModalComponent: 'ModalMobile',
            },
        }),
        viewport: {
            width: 320,
            height: 600,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'ModalMobile | Footer',
    screenshotTesting({
        cases: [
            ...generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    footer: true,
                    'header.title': 'Заголовок',
                    'footer.layout': ['start', 'center', 'space-between', 'column'],
                    ModalComponent: 'ModalMobile',
                },
            }),
        ],
        viewport: {
            width: 320,
            height: 600,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'ModalMobile | Sticky',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Modal',
            testStory: false,
            knobs: {
                open: true,
                header: true,
                footer: true,
                'header.title': 'Заголовок',
                'header.sticky': true,
                'footer.sticky': true,
                showMore: true,
                ModalComponent: 'ModalMobile',
            },
        }),
        viewport: {
            width: 320,
            height: 600,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

// DESKTOP

describe('ModalDesktop', () => {
    const testCase = (theme: string) => {
        return screenshotTesting({
            cases: generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    'header.title': 'Заголовок',
                    'header.hasCloser': true,
                    footer: true,
                    size: 's',
                    ModalComponent: 'ModalDesktop',
                },
            }),
            viewport: {
                width: 1400,
                height: 960,
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

describe(
    'ModalDesktop | sizes',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Modal',
            testStory: false,
            knobs: {
                open: true,
                header: true,
                'header.title': 'Заголовок',
                'header.hasCloser': true,
                footer: true,
                size: ['s', 'm', 'l', 'xl', 'fullscreen'],
                ModalComponent: 'ModalDesktop',
            },
        }),
        viewport: {
            width: 1400,
            height: 960,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'ModalDesktop | Header',
    screenshotTesting({
        cases: [
            ...generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    'header.title': 'Очень очень длинный заголовок-заголовок',
                    'header.hasCloser': [true, false],
                    ModalComponent: 'ModalDesktop',
                },
            }),
            ...generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    'header.title': 'Очень очень длинный заголовок-заголовок',
                    'header.trim': [true, false],
                    ModalComponent: 'ModalDesktop',
                },
            }),
            ...generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    'header.title': 'Заголовок',
                    'header.align': ['left', 'center'],
                    ModalComponent: 'ModalDesktop',
                },
            }),
        ],
        viewport: {
            width: 960,
            height: 960,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'ModalDesktop | Content',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Modal',
            testStory: false,
            knobs: {
                open: true,
                header: true,
                footer: true,
                'header.title': 'Заголовок',
                'content.flex': true,
                ModalComponent: 'ModalDesktop',
            },
        }),
        viewport: {
            width: 960,
            height: 960,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'ModalDesktop | Footer',
    screenshotTesting({
        cases: [
            ...generateTestCases({
                componentName: 'Modal',
                testStory: false,
                knobs: {
                    open: true,
                    header: true,
                    footer: true,
                    'header.title': 'Заголовок',
                    'footer.layout': ['start', 'center', 'space-between', 'column'],
                    ModalComponent: 'ModalDesktop',
                },
            }),
        ],
        viewport: {
            width: 960,
            height: 960,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);

describe(
    'ModalDesktop | Sticky',
    screenshotTesting({
        cases: generateTestCases({
            componentName: 'Modal',
            testStory: false,
            knobs: {
                open: true,
                header: true,
                footer: true,
                'header.title': 'Заголовок',
                'header.sticky': true,
                'footer.sticky': true,
                showMore: true,
                ModalComponent: 'ModalDesktop',
            },
        }),
        viewport: {
            width: 960,
            height: 960,
        },
        screenshotOpts: {
            fullPage: true,
        },
    }),
);
