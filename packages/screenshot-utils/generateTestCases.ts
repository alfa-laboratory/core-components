import {
    KnobsCombinations,
    CreateStorybookUrlParams,
    KnobValueType,
    createStorybookUrl,
} from './createStorybookUrl';
import { generateCombos } from './utils';

export type GenerateTestCasesParams = {
    knobs: KnobsCombinations;
} & Omit<CreateStorybookUrlParams, 'knobs'>;

export const generateTestCases = ({
    knobs,
    ...createStorybookUrlArgs
}: GenerateTestCasesParams) => {
    const knobValues = Object.values(knobs);
    const knobNames = Object.keys(knobs);

    // Генерируем комбинации из набора кнобсов
    const combos = generateCombos<KnobValueType>(knobValues.map(v => (Array.isArray(v) ? v : [v])));

    // Собираем тестовых кейс — имя кейса и словарь из комбинации кнобсов
    const buildTestCase = (knobsCombo: Array<[KnobValueType, number]>) => {
        const knobsVariant: Record<string, KnobValueType> = {};
        let caseName = '';

        knobsCombo.forEach(([knobValue, valueIndex], nameIndex) => {
            const knobName = knobNames[nameIndex];

            knobsVariant[knobName] = knobValue;

            if (Array.isArray(knobValues[nameIndex])) {
                caseName += `${knobName}=${valueIndex}`;
            }
        });

        return { caseName, knobsVariant };
    };

    return combos.map(combo => {
        const { caseName, knobsVariant } = buildTestCase(combo);

        return [
            caseName,
            createStorybookUrl({
                knobs: knobsVariant,
                ...createStorybookUrlArgs,
            }),
        ] as [string, string];
    });
};
