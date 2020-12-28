/**
 * Playwright должен быть установлен глобально через npm
 */
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

        const body = await page.innerHTML('body');
        const head = await page.innerHTML('head');

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
