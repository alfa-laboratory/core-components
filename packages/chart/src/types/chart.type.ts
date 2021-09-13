import { ReactElement } from 'react';
import { RectangleProps } from 'recharts';
import { DataKey } from 'recharts/types/util/types';
import { DotSettingProps } from './utils/dot.type';

import { DataProps } from './utils/data.type';

type CurveType = 'linear' | 'monotone' | 'step';

export type RectangleShapeType =
    | ReactElement<SVGElement>
    | ((props: any) => ReactElement<SVGElement>)
    | RectangleProps
    | boolean;

export interface ChartProps {
    /**
     * Название графика (отображается в легендах и тултипе)
     */
    name?: string;
    /**
     * Ключ данных
     */
    dataKey: DataKey<number | string>;
    /**
     * Цвет заливки графика
     */
    fill?: string;
    /**
     * Цвет линии графика
     */
    stroke?: string;
    /**
     * Отображение точек на графике
     */
    dot?: boolean;
    /**
     * Параметры для точек грфика (если dot: true)
     */
    dotSettings?: DotSettingProps[] | DotSettingProps;
    /**
     * Наследование цвета
     */
    inheritStroke?: boolean;
    /**
     * Форматирование значения графика для тултипа
     */
    formatter?: Function;
    /**
     * Тип линии
     */
    type?: CurveType;
    /**
     * Толщина линии
     */
    strokeWidth?: number;
    /**
     * Прерывистость линии
     */
    strokeDasharray?: string | number;
}

export interface ToggleChartProps {
    chart?: 'line' | 'area' | 'bar' | 'gradient';
    data?: DataProps[];
    icon?: 'circleLine' | 'filledCircle' | 'strokeCircle' | 'circle';
    order?: number;
    properties: ChartProps;
}
