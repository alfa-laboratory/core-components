/* eslint-disable */
type SreenshotOpts = {
    host: string;
    cases: any[];
};

type ScreenshotTestCase = {
    name: string;
    url: string;
};

const getKnobStr = (knob: any) => (param: any) => `knob-${knob.toString()}=${param.toString()}`;

/**
 * Example

getScreenshotTestCases({
    host: 'http://localhost:9009/iframe.html',
    items: [
        {
            group: 'Common',
            name: 'Alert',
            variant: 'Basic',
            params: {
                type: ['default', 'error', 'success', 'default', 'warning'],
                // onClickRightAddon: [true, false],
            },
        },
    ],
});

*/

export const getScreenshotTestCases = (opts: any): any[] => {
    const { host = '', items = [] } = opts;

    const cases = items.map(({ group, name: _name, variant, params }: any) => {
        const knobs = Object.keys(params);
        const testId = `${group.toLowerCase()}--${_name.toLowerCase()}`;

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
                `${_name}:{${paramStr
                    .replace(/&/g, ', ')
                    .replace(/=/g, ': ')
                    .replace(/knob-/g, '')}}`,
                `${host}?id=${testId}&${paramStr}`,
            ]);
        return knobsList;
    });

    return cases.flat();
};
