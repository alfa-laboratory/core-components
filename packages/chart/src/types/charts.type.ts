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
     * Компонент контейнера, позволяющий адаптировать диаграммы к размеру родительского контейнера
     */
    responsiveContainer?: ResponsiveContainerProps;
    /**
     * Диаграмма, состоящая из bar, linear и area диаграмм
     */
    composeChart: ComposedChartProps;
    /**
     * Отображение линий осей графика
     */
    cartesianGrid?: CartesianGridProps;
    /**
     * Настройки оси Х
     */
    xAxis: XAxisProps;
    /**
     * Настройки оси У
     */
    yAxis: YAxisProps;
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
     * Mассив объектов с параметрами грaфиков с обязательным полем
     */
    series: SeriaProps[];
    /**
     * Mассив меток
     */
    labels: Array<string | number>;
    children?: React.ReactNode;
}
