import { ChartProps } from './chart.types';
import { DataProps } from './utils/data.types';
import { GradientProps } from './utils/gradient.types';

export type RadiusProp = {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
};

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
     * Скрыть график в тултипe
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
     * Радиус закругления углов графика типа bar
     */
    radius: RadiusProp | number;

    /**
     * Тип иконки для графика
     */
    icon: 'circleLine' | 'filledCircle' | 'strokeCircle' | 'circle';

    /**
     * Оффсет для градиента (только для типа area)
     */
    offset: number;

    /**
     * Заливка графика
     */
    fill?: string;

    /**
     * Прозрачность
     */
    gradient: {
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
