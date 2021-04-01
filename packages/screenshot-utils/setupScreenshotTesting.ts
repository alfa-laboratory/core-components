import { chromium, Page, Browser, BrowserContext } from 'playwright';
import axios from 'axios';

import { defaultViewport, matchHtml, MatchHtmlParams } from './helpers';

export const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:9009/iframe.html';
export const STYLES_URL = 'http://localhost:9009/main.css';

export type ScreenshotOpts = {
    /**
     * When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport.
     * Defaults to `false`.
     */
    fullPage?: boolean;

    /**
     * Hides default white background and allows capturing screenshots with transparency.
     * Not applicable to `jpeg` images. Defaults to `false`.
     */
    omitBackground?: boolean;

    clip?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
};

export type EvaluateFn = (page: Page) => void;

export type ScreenshotTestingParams = Omit<MatchHtmlParams, 'page' | 'css' | 'expect'> & {
    cases: Array<[string, string]>;
};

export const setupScreenshotTesting = ({
    it,
    beforeAll,
    afterAll,
    expect,
}: {
    it: jest.It;
    beforeAll: jest.Lifecycle;
    afterAll: jest.Lifecycle;
    expect: jest.Expect;
}) => {
    return ({ cases, ...matchHtmlArgs }: ScreenshotTestingParams) => () => {
        let browser: Browser;
        let context: BrowserContext;
        let page: Page;
        let css: string;

        beforeAll(async () => {
            browser = await chromium.launch();
            context = await browser.newContext({ viewport: defaultViewport });
            page = await context.newPage();

            const result = await axios.get(STYLES_URL, {
                responseType: 'text',
            });

            css = result.data;
        });

        afterAll(async () => {
            await browser.close();
        });

        it.each(cases)('%s', async (_, link: string) => {
            await page?.goto(encodeURI(link));

            await matchHtml({
                page,
                expect,
                css,
                ...matchHtmlArgs,
            });
        });
    };
};
