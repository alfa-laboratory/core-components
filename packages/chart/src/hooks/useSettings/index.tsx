import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OptionsProps } from '../../types/options.types';
import { DataDynamicBooleanProps, DataDynamicProps } from '../../types/utils/data.types';

import { setComposedChartsMargin } from './utils/setComposedChartsMargin';
import { setDatas } from './utils/setDatas';
import { setGradientCharts } from './utils/setGradientCharts';
import { setLegendMargin } from './utils/setLegendMargin';
import { sortByIndex } from './utils/sortByIndex';

type Settings = [
    {
        state: OptionsProps | null;
        data: DataDynamicProps[];
        charts: DataDynamicBooleanProps;
        filterCount: number;
    },
    {
        setState: Dispatch<SetStateAction<OptionsProps | null>>;
        setData: Dispatch<SetStateAction<DataDynamicProps[]>>;
        setCharts: Dispatch<SetStateAction<DataDynamicBooleanProps>>;
        setFilterCount: Dispatch<SetStateAction<number>>;
    },
];

export const useSettings = (options: OptionsProps): Settings => {
    const [state, setState] = useState<OptionsProps | null>(null);
    const [charts, setCharts] = useState<DataDynamicBooleanProps>({});
    const [data, setData] = useState<DataDynamicProps[]>([]);
    const [filterCount, setFilterCount] = useState<number>(0);

    useEffect(() => {
        const settings: OptionsProps = JSON.parse(JSON.stringify(options));
        const { brush, legend, series, labels, composeChart, xAxis } = settings;

        if (settings.legend?.margin && brush && legend)
            settings.legend.margin.top = setLegendMargin(brush, legend);

        settings.series = setGradientCharts(series);
        const [initData, chartsNames, count] = setDatas(series, labels);
        settings.composeChart.margin = setComposedChartsMargin(composeChart, legend, brush, xAxis);
        settings.series = sortByIndex(series);

        setState(settings);
        setData(initData);
        setCharts(chartsNames);
        setFilterCount(count);
    }, [options]);

    return [
        {
            state,
            data,
            charts,
            filterCount,
        },
        {
            setState,
            setData,
            setCharts,
            setFilterCount,
        },
    ];
};
