/* eslint-disable @typescript-eslint/no-explicit-any */
import { chromium, Page, Browser, BrowserContext } from 'playwright';
import axios from 'axios';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import kebab from 'lodash.kebabcase';

export const STORYBOOK_URL = process.env.STORYBOOK_URL || 'http://localhost:9009';

type CustomSnapshotIdentifierParams = {
    currentTestName: string;
    counter: number;
    defaultIdentifier: string;
    testPath: string;
};

/**
 * Удаляем из названия теста лишнюю информацию, чтобы имя файла было короче
 */
const customSnapshotIdentifier = ({ currentTestName }: CustomSnapshotIdentifierParams) => {
    const [knobsStrObj] = /(\{.{1,}\})/.exec(currentTestName) || [];
    return kebab(`${knobsStrObj}`);
};

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

        const result = await axios.get(`${STORYBOOK_URL}/main.css`, {
            responseType: 'text',
        });

        css = result.data;
    });

    afterAll(async () => {
        await browser.close();
    });

    it.each(cases)('%s', async (testName: string, link: string) => {
        await page?.goto(encodeURI(link));

        const body = await page?.innerHTML('body');
        const head = await page?.innerHTML('head');

        const pageHtml = `<html><head>${head}</head><body><style>${css}</style>${body}</body></html>`;

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
    });
};
