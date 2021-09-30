import React from 'react';
import { BrushProps } from './brush.types';
import { CartesianGridProps } from './cartesianGrid.types';
import { ComposedChartProps } from './composedChart.types';
import { LegendProps } from './legend.types';
import { TooltipProps } from './tooltip.types';
import { XAxisProps } from './xAxis.types';
import { YAxisProps } from './yAxis.types';
import { SeriaProps } from './seria.types';
import { ResponsiveContainerProps } from './responsiveContainer.types';

export interface OptionsProps {
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
