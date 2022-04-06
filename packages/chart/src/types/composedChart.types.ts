export interface ComposedChartProps {
    /**
     * Отступы графика на момент инициализации компонента
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
     * Ширина или высота каждой полосы. Если barSize не указан, размер бара будет рассчитываться по barCategoryGap,
     * barGap и количеству групп баров
     */
    barSize?: number;

    /**
     * Разрыв между двумя категориями столбцов, который может быть процентным или фиксированным значением
     */
    barCategoryGap?: string | number;

    /**
     * Разрыв между двумя столбцами одной категории
     */
    barGap?: number;

    /**
     * Делать опасити всем элементам кроме наведенного
     */
    unfocusedAnimation?: boolean;
}
