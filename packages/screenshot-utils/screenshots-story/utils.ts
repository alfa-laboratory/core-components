import qs from 'querystring';

export const queryParams = qs.parse(document.location.search);

export const getQueryParam = (param: string) => queryParams[param] as string;

export const parseKnobs = () =>
    Object.entries(queryParams).reduce((acc, [k, v]) => {
        if (k.startsWith('knob-')) {
            acc[k.replace('knob-', '')] = parseValue(v as string);
        }

        return acc;
    }, {});

function parseValue(value: string) {
    const isBoolean = () => ['true', 'false'].includes(value);
    const isNumeric = () => !Number.isNaN(+value) && !Number.isNaN(parseFloat(value));

    if (!value) return undefined;

    if (isBoolean()) return value === 'true';

    if (isNumeric()) return parseFloat(value);

    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}
