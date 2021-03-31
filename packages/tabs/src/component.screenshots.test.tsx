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

// TODO: кривые скриншоты
describe('Tabs | TabsDesktop', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: generateTestCases({
                componentName: 'Tabs',
                subComponentName: 'TabsDesktop',
                testStory: false,
                knobs: {
                    view: ['primary', 'secondary'],
                    size: ['s', 'm', 'l', 'xl'],
                },
            }),
            viewport: {
                width: 700,
                height: 150,
            },
            matchImageSnapshotOptions: {
                customSnapshotIdentifier: (...args) =>
                    `${theme}-${customSnapshotIdentifier(...args)}`,
            },
            theme,
        })();

    ['default', 'click', 'site', 'corp'].map(testCase);
});
