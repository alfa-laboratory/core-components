import { setupScreenshotTesting, generateTestCases } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const clip = { x: 0, y: 0, width: 1024, height: 50 };

describe('SteppedProgressBar | main props', () => {
    const testCaseFactory = (theme: string) =>
        screenshotTesting({
            cases: generateTestCases({
                componentName: 'SteppedProgressBar',
                knobs: {
                    step: [-2, 0, 2, 10, 12],
                    maxStep: [-10, 0, 10],
                    description: ['Шаг 2 из 10: Выбор карты', ''],
                },
            }),
            screenshotOpts: {
                clip,
            },
            theme,
        })();
    ['default', 'click'].map(testCaseFactory);
});
