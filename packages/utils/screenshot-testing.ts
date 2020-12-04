import { webkit, Page, Browser, BrowserContext } from 'playwright';

const screenshotOpts = {
    clip: {
        x: 0,
        y: 0,
        width: 2000,
        height: 100,
    },
};

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
        await page?.goto(link);
        const image = await page?.screenshot(screenshotOpts);

        expect(image).toMatchImageSnapshot();
    });
};
