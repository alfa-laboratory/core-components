import { DataProps } from '../../../types/utils/data.types';
import { SeriaProps } from '../../../types/seria.types';

export const setGradientCharts = (series: SeriaProps[]): SeriaProps[] => {
    const filterSeries = series.filter(item => item.chart !== 'gradient');

    return filterSeries.reduce((accum: SeriaProps[], item: SeriaProps) => {
        const { chart, data: dataSeria, offset, fill } = item;

        if (chart === 'area') {
            let newData = null;
            if (offset) {
                newData = dataSeria.map((d: DataProps) => {
                    const { label, value } = d;
                    return {
                        label,
                        value: Math.ceil(value - value * offset),
                    };
                });
            }

            accum.push({
                ...item,
                zIndex: -100,
                chart: 'gradient',
                hideLegend: true,
                hideTooltip: true,
                properties: {
                    ...item.properties,
                    dataKey: `${item.properties.dataKey}-gradient`,
                    fill,
                },
                data: newData || item.data,
            });
        }

        accum.push(item);
        return accum;
    }, []);
};
