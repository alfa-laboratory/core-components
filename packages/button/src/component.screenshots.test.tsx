/* eslint-disable */
import { screenshotTesting, getScreenshotTestCases } from '../../utils';

const cases = getScreenshotTestCases({
    items: [
        {
            group: 'Компоненты',
            name: 'button',
            params: {
                // view: ['primary', 'secondary', 'outlined', 'filled', 'link', 'ghost'],
                // size: ['xs', 's', 'm', 'l', 'xl'],
                // block: [true, false],
                // loading: [true, false],
                view: ['primary', 'secondary'],
                size: ['s', 'm'],
            },
        },
    ],
});

describe('Button | screenshots', screenshotTesting(cases, it, beforeAll, afterAll, expect));
