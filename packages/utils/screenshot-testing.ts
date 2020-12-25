/**
 * Playwright должен быть установлен глобально через npm
 */
import { webkit, Page, Browser, BrowserContext } from 'playwright';
import axios from 'axios';

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

    beforeAll(async () => {
        browser = await webkit.launch();
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    it.each(cases)('%s', async (name: string, link: string) => {
        await page?.goto(encodeURI(link));

        const body = await page.innerHTML('body');
        const head = await page.innerHTML('head');

        const { data: css } = await axios.get('http://localhost:9009/main.css', {
            responseType: 'text',
        });

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
