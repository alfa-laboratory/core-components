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

const clip = { x: 0, y: 0, width: 480, height: 100 };

describe('ToastPlate | main props', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    `${theme} theme`,
                    createSpriteStorybookUrl({
                        componentName: 'ToastPlate',
                        knobs: {
                            children: 'Вам одобрено. Согласитесь на предложение',
                            badge: ['attention', 'positive', 'negative', ''],
                            title: ['', 'Поздравляем, полный успех'],
                            hasCloser: [false, true],
                        },
                        size: clip,
                    }),
                ],
            ],
            screenshotOpts: {
                fullPage: true,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
});

describe('ToastPlate | action button', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: generateTestCases({
                componentName: 'ToastPlate',
                testStory: false,
                knobs: {
                    children: 'Вам одобрено',
                    title: 'Поздравляем',
                    renderActionButton: true,
                },
            }),
            screenshotOpts: {
                clip,
            },
            matchImageSnapshotOptions: {
                customSnapshotIdentifier: (...args) =>
                    `${theme}-${customSnapshotIdentifier(...args)}`,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
});
