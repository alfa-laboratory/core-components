export interface ComposedChartProps {
    /**
     * Отступы внутри графика для иницилизации
     */
    initMargin?: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
    };
    /**
     * Отступы которые высчитываются автоматически, основаны на initMargin и отступах разных елементов
     */
    margin?: {
        top?: number;
        right?: number;
        left?: number;
        bottom?: number;
    };
    /**
     * Максимальная ширина графиков типа bar
     */
    maxBarSize?: number;
    /**
     * Разрыв между двумя категориями столбцов, который может быть процентным или фиксированным значением
     */
    barCategoryGap?: string | number;
    /**
     * Ширина графиков типа bar
     */
    barGap?: number;
}
