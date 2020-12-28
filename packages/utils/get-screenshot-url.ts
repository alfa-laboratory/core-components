/* eslint-disable */

import { STORYBOOK_URL } from './screenshot-testing';

const getKnobStr = (knob: any) => (param: any) => `knob-${knob.toString()}=${param.toString()}`;

export const getScreenshotTestCases = (opts: any): any[] => {
    const { host = `${STORYBOOK_URL}/iframe.html`, items = [], variant = '' } = opts;

    const cases = items.map(({ group, name, variant, params }: any) => {
        const knobs = Object.keys(params);
        const testId = `${group.toLowerCase()}--${name.toLowerCase()}`;

        const knobsList = knobs
            // Convert param object to string
            .map(knob => params[knob].map(getKnobStr(knob)))
            // Join all params in one string
            .reduce((acc, curr) => {
                if (acc.length) {
                    return curr.map((i: string) => acc.map((j: string) => `${j}&${i}`));
                }

                return curr;
            }, [])
            .flat()
            // Create Screenshot test case object
            .map((paramStr: string) => [
                `${name}:{${paramStr
                    .replace(/&/g, ', ')
                    .replace(/=/g, ': ')
                    .replace(/knob-/g, '')}}`,
                `${host}?id=${testId}&${paramStr}`,
            ]);
        return knobsList;
    });

    return cases.flat();
};
