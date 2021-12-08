/* eslint-disable */
import {
    Browser,
    Page,
    BrowserContext,
    BrowserType,
    FirefoxBrowser,
    WebKitBrowser,
    ChromiumBrowser,
    chromium,
} from 'playwright';
import axios from 'axios';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import kebab from 'lodash.kebabcase';
import {
    STYLES_URL,
    VENDOR_STYLES_URL,
    ScreenshotOpts,
    EvaluateFn,
} from './setupScreenshotTesting';

type CustomSnapshotIdentifierParams = {
    currentTestName: string;
    counter: number;
    defaultIdentifier: string;
    testPath: string;
};

type CloseBrowserParams = {
    page: Page;
    context: BrowserContext;
    browser: Browser;
};

const CI = process.env.CI === 'true';

const serverHost = CI ? 'https://digital.alfabank.ru' : 'http://digital';
const playwrightUrl = `${serverHost}/playwright`;

export const defaultViewport = { width: 1024, height: 768 };

/**
 * Удаляем из названия теста лишнюю информацию, чтобы имя файла было короче
 */
export const customSnapshotIdentifier = ({
    currentTestName,
    counter,
}: CustomSnapshotIdentifierParams) => {
    return kebab(`${currentTestName}${counter > 1 ? `-${counter}` : ''}`);
};

const getPageHtml = async (page: Page, css?: string) => {
    const [head, body] = await Promise.all([page?.innerHTML('head'), page?.innerHTML('body')]);

    return `<html><head><style>${css}</style>${head}</head><body>${body}</body></html>`;
};

export type MatchHtmlParams = {
    page: Page;
    css?: string;
    expect: any;
    matchImageSnapshotOptions?: MatchImageSnapshotOptions;
    screenshotOpts?: ScreenshotOpts;
    evaluate?: EvaluateFn;
    viewport?: { width: number; height: number };
};

const screenshotDefaultOpts = {
    clip: {
        x: 0,
        y: 0,
        width: 1920,
        height: 500,
    },
    fullPage: false,
    omitBackground: false,
};

export const matchHtml = async ({
    page,
    css,
    expect,
    matchImageSnapshotOptions,
    screenshotOpts = screenshotDefaultOpts,
    evaluate,
    viewport = defaultViewport,
}: MatchHtmlParams) => {
    let pageHtml = await getPageHtml(page, css);

    // FIXME: gcdn.co недоступен на playwright сервере
    pageHtml = pageHtml.replace(/alfabank\.gcdn\.co/g, 'alfabank.st');

    const image = await axios.post(
        playwrightUrl,
        {
            data: pageHtml,
            screenshotOpts,
            evaluate: evaluate && evaluate.toString(),
            viewport,
        },
        {
            responseType: 'arraybuffer',
            headers: {
                accept: 'application/json',
            },
            auth: CI
                ? {
                      username: process.env.CI_USER_NAME as string,
                      password: process.env.CI_USER_PASSWORD as string,
                  }
                : undefined,
        },
    );

    try {
        expect(image.data).toMatchImageSnapshot({
            customSnapshotIdentifier,
            ...matchImageSnapshotOptions,
        });
    } catch (e) {
        console.error(page.url());
        throw e;
    }
};

export const openBrowserPage = async (
    pageUrl: string,
    browserType: BrowserType<ChromiumBrowser | FirefoxBrowser | WebKitBrowser> = chromium,
) => {
    const browser = await browserType.launch();
    const context = await browser.newContext({ viewport: defaultViewport });
    const page = await context.newPage();

    const [mainCss, vendorCss] = await Promise.all([
        axios.get(STYLES_URL, {
            responseType: 'text',
        }),
        axios.get(VENDOR_STYLES_URL, { responseType: 'text' }),
        page.goto(pageUrl),
    ]);

    const css = `${mainCss?.data}\n${vendorCss?.data}`;

    return { browser, context, page, css };
};

export const closeBrowser = async ({ page, context, browser }: CloseBrowserParams) => {
    await page.close();
    await context.close();
    await browser.close();
};
