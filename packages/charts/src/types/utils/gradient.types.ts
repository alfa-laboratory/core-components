export interface GradientProps {
    /**
     * Отступ.
     */
    offset: number;

    /**
     * Цвет.
     */
    stopColor: string;

    /**
     * Значение празрачности.
     */
    stopOpacity: number;
}

export interface LinearGradientProps {
    /**
     * Индефикатор графика.
     */
    id: string;

    /**
     * Индефикатор градиента.
     */
    gid: string;

    /**
     * Массив настроек градинта.
     */
    points: GradientProps[];
}
