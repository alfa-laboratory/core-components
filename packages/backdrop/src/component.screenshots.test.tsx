import {
    setupScreenshotTesting,
    generateTestCases,
    customSnapshotIdentifier,
} from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe('Backdrop', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: generateTestCases({
                componentName: 'Backdrop',
                knobs: {
                    open: [true],
                    invisible: [false, true],
                },
                testStory: false,
            }),
            viewport: {
                width: 100,
                height: 100,
            },
            screenshotOpts: {
                clip: { x: 0, y: 0, width: 100, height: 100 },
            },
            matchImageSnapshotOptions: {
                customSnapshotIdentifier: (...args) =>
                    `${theme}-${customSnapshotIdentifier(...args)}`,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
});
