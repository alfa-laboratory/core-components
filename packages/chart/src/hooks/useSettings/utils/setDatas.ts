import {
    DataDynamicBooleanProps,
    DataDynamicProps,
    DataProps,
} from '../../../types/utils/data.types';
import { SeriaProps } from '../../../types/seria.types';

type DatasResultProps = [DataDynamicProps[], DataDynamicBooleanProps, number];

export const setDatas = (
    series: SeriaProps[],
    labels: Array<string | number>,
): DatasResultProps => {
    const initData: DataDynamicProps[] = [];
    const chartsNames: DataDynamicBooleanProps = {};
    let count = 0;

    for (let i = 0; i < series.length; i++) {
        const {
            properties: { dataKey = '' } = {},
            data: seriaData = [],
            hideLegend,
            hide,
        } = series[i];

        if (!hideLegend && !hide) count += 1;

        labels.map(label => {
            const item = seriaData.find((d: DataProps) => d.label === label);

            if (item) {
                const obj: DataDynamicProps = {
                    label,
                };
                obj[`${dataKey}`] = item.value;

                if (!chartsNames[`${dataKey}`]) chartsNames[`${dataKey}`] = true;

                const index = initData
                    .map((dataItem: DataDynamicProps) => dataItem.label)
                    .indexOf(label);
                if (index === -1) initData.push(obj);
                else initData[index] = { ...initData[index], ...obj };
            }

            return null;
        });
    }
    return [initData, chartsNames, count];
};
