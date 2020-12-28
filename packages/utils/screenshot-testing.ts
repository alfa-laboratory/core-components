/* eslint-disable multiline-comment-style */
import { chromium, Page, Browser, BrowserContext } from 'playwright';
import axios from 'axios';

export const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:9009';

export const screenshotTesting = (
    cases: any[],
    it: any,
    beforeAll: any,
    afterAll: any,
    expect: any,
) => () => {
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let css: string;

    beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();

        const result = await axios.get(`${STORYBOOK_URL}/main.css`, {
            responseType: 'text',
        });

        css = result.data;
    });

    afterAll(async () => {
        await browser.close();
    });

    it.each(cases)('%s', async (name: string, link: string) => {
        await page?.goto(encodeURI(link));

        const body = await page?.innerHTML('body');
        const head = await page?.innerHTML('head');

        const image = await axios.post(
            'http://digital/playwright',
            {
                data: `<html><head>${head}</head><body><style>${css}</style>${body}</body></html>`,
            },
            {
                responseType: 'arraybuffer',
            },
        );

        expect(image.data).toMatchImageSnapshot();
    });
};


// Попытка запускать тесты параллельно пока ни к чему хорошему не привела
// export const screenshotTesting = (
//     cases: any[],
//     it: any,
//     beforeAll: any,
//     afterAll: any,
//     expect: any,
// ) => () => {
//     let browser: Browser;

//     const preparePlaywright: () => Promise<{ css: string; context: BrowserContext }> = async () => {
//         browser = await chromium.launch();
//         const context = await browser.newContext();

//         const { data: css } = await axios.get(`${STORYBOOK_URL}/main.css`, {
//             responseType: 'text',
//         });

//         return { context, css };
//     };

//     /**
//      * Workaround
//      * https://github.com/facebook/jest/issues/4281
//      */
//     const prepare = preparePlaywright();

//     afterAll(async () => {
//         await browser.close();
//     });

//     it.concurrent.each(cases)('%s', async (name: string, link: string) => {
//         const { css, context } = await prepare;

//         const page = await context.newPage();

//         await page.goto(encodeURI(link));

//         const body = await page?.innerHTML('body');
//         const head = await page?.innerHTML('head');

//         const image = await axios.post(
//             'http://digital/playwright',
//             {
//                 data: `<html><head>${head}</head><body><style>${css}</style>${body}</body></html>`,
//             },
//             {
//                 responseType: 'arraybuffer',
//             },
//         );

//         expect(image.data).toMatchImageSnapshot();
//     });
// };
