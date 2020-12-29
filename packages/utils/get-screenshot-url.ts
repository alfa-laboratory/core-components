import qs from 'querystring';

import { STORYBOOK_URL } from './screenshot-testing';

type KnobValueType = string | boolean | number;

type KnobsCombinations = {
    [key: string]: KnobValueType[];
};

type Knobs = {
    [key: string]: KnobValueType;
};

type CreateStorybookUrlParams = {
    url?: string;
    group?: string;
    componentName: string;
    knobs?: Knobs;
};

export const createStorybookUrl = ({
    url = STORYBOOK_URL,
    group = 'компоненты',
    componentName,
    knobs = {},
}: CreateStorybookUrlParams) => {
    const preparedKnobs = Object.keys(knobs).reduce<Knobs>((acc, knobName) => {
        acc[`knob-${knobName}`] = knobs[knobName];
        return acc;
    }, {});

    return `${url}?id=${group}--${componentName}&${qs.stringify(preparedKnobs)}`;
};

type ComponentScreenshotTestCasesParams = {
    storybookUrl?: string;
    group?: string;
    componentName: string;
    knobs: KnobsCombinations;
};

type JestTestArgs = Array<[string, string]>;

type Node = {
    name: string;
    value: KnobValueType;
    nodes: Node[];
};

export const getComponentScreenshotTestCases = ({
    storybookUrl,
    group,
    componentName,
    knobs,
}: ComponentScreenshotTestCasesParams): JestTestArgs => {
    const knobsNames = Object.keys(knobs);
    const knobsValues = Object.values(knobs);
    const rootNode: Node = { name: 'root', nodes: [], value: 'root' };

    const getNextKnobName = (knobName: string): string => {
        if (knobName === 'root') {
            return knobsNames[0];
        }

        const index = knobsNames.indexOf(knobName);

        return index === knobsNames.length - 1 ? '' : knobsNames[index + 1];
    };

    const getNextKnobValues = (knobName: string): KnobValueType[] => {
        if (knobName === 'root') {
            return knobsValues[0];
        }

        const index = knobsNames.indexOf(knobName);

        return index === knobsValues.length - 1 ? [] : knobsValues[index + 1];
    };

    const createNodes = (node: Node) => {
        const row = knobsNames.indexOf(node.name);

        if (row === knobsNames.length) {
            return;
        }

        const nextKnobValues = getNextKnobValues(node.name);
        const nextKnobName = getNextKnobName(node.name);

        // eslint-disable-next-line no-param-reassign
        node.nodes = nextKnobValues.map(value => ({
            name: nextKnobName,
            value,
            nodes: [],
        }));

        node.nodes.forEach(currNode => {
            createNodes(currNode);
        });
    };

    createNodes(rootNode);

    const result: JestTestArgs = [];

    const visitNode = (node: Node, currKnobs: Knobs) => {
        node.nodes.forEach(currNode => {
            visitNode(currNode, {
                ...currKnobs,
                [currNode.name]: currNode.value,
            });
        });

        if (node.nodes.length === 0) {
            result.push([
                JSON.stringify(currKnobs),
                createStorybookUrl({
                    componentName,
                    group,
                    url: storybookUrl,
                    knobs: currKnobs,
                }),
            ]);
        }
    };

    visitNode(rootNode, {});

    return result;
};
