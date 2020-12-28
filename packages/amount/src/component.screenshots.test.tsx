/**
 * @jest-environment node
 */
/* eslint-disable */

import axios from 'axios';

import { screenshotTesting, getScreenshotTestCases } from '../../utils';

const cases = getScreenshotTestCases({
    host: 'http://localhost:9009/iframe.html',
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

// describe('Amount | screenshots', screenshotTesting(cases, it, beforeAll, afterAll, expect));

// WIP
import { webkit, Page, Browser, BrowserContext } from 'playwright';

const screenshotOpts = {
    clip: {
        x: 0,
        y: 0,
        width: 2000,
        height: 100,
    },
};

describe('Next', () => {
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

    it('test', async () => {
        // const html = await axios.get('http://localhost:3000');
        await page.goto('http://localhost:9009/iframe.html?id=components--amount');
        const html = await page.content();
        await page.setContent(html);
        // const pageR = await page.setContent('<p>Test</p>');
        console.info(html);
        const image = await page.screenshot();
        // const image = await axios.post('http://digital/playwright', {
        //     data: html,
        // }, {
        //     responseType: 'arraybuffer',
        // });

        // expect(image).toMatchImageSnapshot();
    });
});

test.skip('playground', async () => {
    try {
        const html = await axios.get('http://localhost:3000');
        console.info(html.data);
        const image = await axios.post(
            'http://digital/playwright',
            {
                data: html.data,
            },
            {
                responseType: 'arraybuffer',
            },
        );

        expect(image.data).toMatchImageSnapshot();
    } catch (e) {
        console.info(e);
        expect(e).toEqual('');
    }
});
