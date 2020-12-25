/* eslint-disable */
import { screenshotTesting, getScreenshotTestCases } from '../../utils';

const cases = getScreenshotTestCases({
    host: 'http://localhost:9009/iframe.html',
    items: [
        {
            group: 'Компоненты',
            name: 'button',
            variant: '',
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
