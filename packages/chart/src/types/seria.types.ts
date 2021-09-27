import { ChartProps } from './chart.types';
import { DataProps } from './utils/data.types';
import { GradientProps } from './utils/gradient.types';

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
