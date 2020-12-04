/* eslint-disable */
/**
 * @jest-environment node
 */

import axios from 'axios';

import { webkit, Page, Browser, BrowserContext } from 'playwright';

import { getScreenshotTestCases } from './get-screenshot-url';

const screenshotOpts = {
    clip: {
        x: 0,
        y: 0,
        width: 2000,
        height: 100,
    },
};

const cases = getScreenshotTestCases({
    host: 'http://localhost:9009/iframe.html',
    browsers: ['chrome', 'firefox', 'ie'],
    items: [
        {
            group: 'components',
            name: 'amount',
            variant: '',
            params: {
                value: [12300, 40000, 12000],
                currency: ['RUR', 'EUR', 'USD', 'SOS', 'ZAR'],
                // view: ['default', 'withZeroMinorPart'],
            },
        },
    ],
});

// console.info(cases);

describe('Button | screenshots', () => {
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    beforeAll(async () => {
        browser = await webkit.launch();
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it.each(cases)('%s', async (name, link) => {
        await page?.goto(link);
        const image = await page?.screenshot(screenshotOpts);

        expect(image).toMatchImageSnapshot();
    });
});

// // WIP

// test.skip('playground', async () => {
//     try {
//         const html = await axios.get('http://example.org/');
//         // const html = await axios.get('http://localhost:9009/iframe.html?id=components--amount');
//         // const html = await axios.get('http://localhost:9009/iframe.html?id=%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D1%8B--button');

//         const image = await axios.post('http://digital/playwright', {
//             data: html.data,
//         }, {
//             responseType: 'arraybuffer',
//         });

//         // const healf = await axios.get('http://digital/playwright/healf');
//         // console.info(healf.data);

//         expect(image.data).toMatchImageSnapshot();
//     } catch(e) {
//         expect(e).toEqual('');
//     }
// });
