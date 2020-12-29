/* eslint-disable @typescript-eslint/no-explicit-any */
import { chromium, Page, Browser, BrowserContext } from 'playwright';
import axios from 'axios';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';

import { matchHtml } from './helpers';

export const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:9009/iframe.html';
export const STYLES_URL = 'http://localhost:9009/main.css';

export const screenshotTesting = (
    cases: any[],
    it: any,
    beforeAll: any,
    afterAll: any,
    expect: any,
    matchImageSnapshotOptions?: MatchImageSnapshotOptions,
) => () => {
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let css: string;

    beforeAll(async () => {
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();

        const result = await axios.get(STYLES_URL, {
            responseType: 'text',
        });

        css = result.data;
    });

    afterAll(async () => {
        await browser.close();
    });

    it.each(cases)('%s', async (testName: string, link: string) => {
        await page?.goto(encodeURI(link));

        await matchHtml({ page, expect, css, matchImageSnapshotOptions });
    });
};
