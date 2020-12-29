/* eslint-disable */
import {
    Browser,
    Page,
    BrowserContext,
    BrowserType,
    FirefoxBrowser,
    WebKitBrowser,
    ChromiumBrowser,
} from 'playwright';
import axios from 'axios';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import kebab from 'lodash.kebabcase';
import { STYLES_URL } from './screenshot-testing';

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

/**
 * Удаляем из названия теста лишнюю информацию, чтобы имя файла было короче
 */
const customSnapshotIdentifier = ({ currentTestName, counter }: CustomSnapshotIdentifierParams) => {
    const [knobsStrObj] = /(\{.{1,}\})/.exec(currentTestName) || [];

    if (!knobsStrObj) {
        return kebab(`${currentTestName}-${counter}`);
    }

    return kebab(`${knobsStrObj}-${counter}`);
};

const getPageHtml = async (page: Page, css?: string) => {
    const [head, body] = await Promise.all([page?.innerHTML('head'), page?.innerHTML('body')]);
    // TODO: сервер работает нестабильно, если передавать туда стили, возможно ограничение на размер json
    // return `<html><head>${head}</head><body><style>${css}</style>${body}</body></html>`;
    return `<html><head>${head}</head><body>${body}</body></html>`;
};

type MatchHtmlParams = {
    page: Page;
    css?: string;
    expect: any;
    matchImageSnapshotOptions?: MatchImageSnapshotOptions;
};

export const matchHtml = async ({
    page,
    css,
    expect,
    matchImageSnapshotOptions,
}: MatchHtmlParams) => {
    const pageHtml = await getPageHtml(page, css);

    const image = await axios.post(
        'http://digital/playwright',
        {
            data: pageHtml,
        },
        {
            responseType: 'arraybuffer',
        },
    );

    expect(image.data).toMatchImageSnapshot({
        customSnapshotIdentifier,
        ...matchImageSnapshotOptions,
    });
};

export const openBrowser = async (
    browserType: BrowserType<ChromiumBrowser | FirefoxBrowser | WebKitBrowser>,
    pageUrl: string,
) => {
    const browser = await browserType.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    const [css] = await Promise.all([
        axios.get(STYLES_URL, {
            responseType: 'text',
        }),
        page.goto(pageUrl),
    ]);

    return { browser, context, page, css: css?.data };
};

export const closeBrowser = async ({ page, context, browser }: CloseBrowserParams) => {
    await page.close();
    await context.close();
    await browser.close();
};
