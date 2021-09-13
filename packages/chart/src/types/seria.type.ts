import { ChartProps } from './chart.type';
import { DataProps } from './utils/data.type';
import { GradientProps } from './utils/gradient.type';

export interface SeriaProps {
    /**
     * Скрыть график
     */
    hide?: boolean;
    /**
     * Скрыть график в легенде
     */
    hideLegend?: boolean;
    /**
     * Скрыть график в тултипк
     */
    hideTooltip?: boolean;
    /**
     * Z-index графика
     */
    zIndex?: number;
    /**
     * Тип графика
     */
    chart: 'line' | 'area' | 'bar' | 'gradient';
    /**
     * Тип иконки для графика
     */
    icon: 'circleLine' | 'filledCircle' | 'strokeCircle' | 'circle';
    /**
     * Оффсет для градиента (только для типа area)
     */
    offset?: number;
    /**
     * Заливка графика
     */
    fill?: string;
    /**
     * Параметры градиента
     */
    gradient?: {
        /**
         * Индефикатор градиента
         */
        gid: string;
        /**
         * Параметра точек для градиента
         */
        points: GradientProps[];
    };
    /**
     * Параметры графика
     */
    properties: ChartProps;
    /**
     * Данные для построения графика
     */
    data: DataProps[];
}
