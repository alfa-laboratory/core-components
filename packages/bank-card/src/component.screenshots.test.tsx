import { createSpriteStorybookUrl, setupScreenshotTesting } from '../../screenshot-utils';

const screenshotTesting = setupScreenshotTesting({
    it,
    beforeAll,
    afterAll,
    expect,
});

const VISA_VALID_NUMBER = '4111111111111111';
const MC_VALID_NUMBER = '5500000000000004';
const MIR_VALID_NUMBER = '2201382000000013';
const MAESTRO_VALID_NUMBER = '6759649826438453';
const NOT_VALID_CARD = '1234567891111111';

describe(
    'BankCard | screenshots',
    screenshotTesting({
        cases: [
            [
                'sprite',
                createSpriteStorybookUrl({
                    componentName: 'BankCard',
                    knobs: {
                        value: [
                            VISA_VALID_NUMBER,
                            MC_VALID_NUMBER,
                            MIR_VALID_NUMBER,
                            MAESTRO_VALID_NUMBER,
                            NOT_VALID_CARD,
                        ],
                    },
                    size: { width: 360, height: 240 },
                }),
            ],
        ],
        screenshotOpts: {
            fullPage: true,
        },
    }),
);
