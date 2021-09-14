import React from 'react';
import { BrushProps } from './brush.type';
import { CartesianGridProps } from './cartesianGrid.type';
import { ComposedChartProps } from './composedChart.type';
import { LegendProps } from './legend.type';
import { TooltipProps } from './tooltip.type';
import { XAxisProps } from './xAxis.type';
import { YAxisProps } from './yAxis.type';
import { SeriaProps } from './seria.type';
import { ResponsiveContainerProps } from './responsiveContainer.type';

export interface ChartsProps {
    /**
     * Индефикатор графика
     */
    id: string;
    /**
     * Компонент контейнера, позволяющий адаптировать диаграммы к размеру родительского контейнера.
     */
    responsiveContainer?: ResponsiveContainerProps;
    /**
     * Диаграмма, состоящая из линейных диаграмм, диаграмм с областями и гистограмм.
     */
    composeChart: ComposedChartProps;
    /**
     * Компонент линий осей графика
     */
    cartesianGrid: CartesianGridProps;
    /**
     * Ось Х графика
     */
    xAxis?: XAxisProps;
    /**
     * Ось У графика
     */
    yAxis?: YAxisProps;
    /**
     * Всплывающаяся подсказка
     */
    tooltip?: TooltipProps;
    /**
     * Компонент маштабирования графика
     */
    brush?: BrushProps;
    /**
     * Компонент подписи графиков
     */
    legend?: LegendProps;
    /**
     * Массив графиков для отображения
     */
    series: SeriaProps[];
    /**
     * "Положение" в поле просмотра декартовых координат
     */
    labels: Array<string | number>;
    children?: React.ReactNode;
}
