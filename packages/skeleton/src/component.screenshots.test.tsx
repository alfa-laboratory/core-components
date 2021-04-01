import { setupScreenshotTesting, createSpriteStorybookUrl } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

describe('Skeleton', () => {
    const testCase = (theme: string) =>
        screenshotTesting({
            cases: [
                [
                    `${theme} theme`,
                    createSpriteStorybookUrl({
                        componentName: 'Skeleton',
                        knobs: {
                            children: 'Skeleton Skeleton Skeleton Skeleton Skeleton',
                            animate: false,
                            visible: [false, true],
                        },
                        size: { width: 200, height: 100 },
                    }),
                ],
            ],
            screenshotOpts: {
                fullPage: true,
            },
            viewport: {
                width: 450,
                height: 100,
            },
            theme,
        })();

    ['default', 'click'].map(testCase);
});
