import { CoordinatesProps } from './coordinates.type';
import { DataProps } from './data.type';

export interface DotSettingProps {
    /**
     * Значение media query.
     */
    media?: number;
    /**
     * Значение маштаба при ховере.
     */
    scale: number;
    /**
     * Начальный значения маштаба.
     */
    initScale: number;
    /**
     * Ширина точки.
     */
    width: number;
    /**
     * Высота точки.
     */
    height: number;
}

export interface ActiveDotProps {
    /**
     * Индекс предыдущей точки.
     */
    prev: number | null;
    /**
     * Индекс активной точки.
     */
    active: number | null;
}

export interface PointProps extends CoordinatesProps {
    value: string | number;
    payload: DataProps;
}

export interface DotProps {
    /**
     * Индекс активной точки на графике.
     */
    activeDot: null | number;
    /**
     * Координата Х.
     */
    cx: number;
    /**
     * Координата У.
     */
    cy: number;
    /**
     * Ключ данных.
     */
    dataKey: string;
    /**
     * Параметры точки.
     */
    dotSettings?: DotSettingProps;
    /**
     * Индекс.
     */
    index: number;
    /**
     * Цвет линии.
     */
    stroke: string;
    /**
     * Значения по этим координатам.
     */
    value: number;
}
