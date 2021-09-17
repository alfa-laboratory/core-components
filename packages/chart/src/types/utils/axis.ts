import { ReactElement, SVGProps } from 'react';

export interface AxisProps {
    /**
     * Скрыть ось
     */
    hide?: boolean;
    /**
     * Отображение линии оси.
     */
    axisLine: boolean;
    /**
     * Тип оси.
     */
    type: 'number' | 'category';
    /**
     * Разрешить значениям оси быть десятичными или нет.
     */
    allowDecimals?: boolean;
    /**
     * Разрешить или нет на оси дублировать категории, если "type" оси - "category".
     */
    allowDuplicatedCategory?: boolean;
    /**
     * Угол наклона значений оси.
     */
    angle?: number;
    /**
     * Количество делений оси. Не используется, если "тип" - "категория".
     */
    tickCount?: number;
    /**
     * Интревал линий деления оси
     */
    interval?: 'preserveStart' | 'preserveEnd' | 'preserveStartEnd' | number;
    /**
     * Минимальный зазор между двумя соседними делениями оси.
     */
    minTickGap?: number;
    /**
     * Отображение линий деления оси
     */
    tickLine?: boolean;
    /**
     * Размер линий деления оси
     */
    tickSize?: number;
    /**
     * Если установлено значение true, галочки переворачиваются вокруг оси, отображая метки внутри диаграммы, а не снаружи.
     */
    mirror?: boolean;
    /**
     * Отображение горизонтальной сетки
     */
    reversed?: boolean;
    /**
     * Реверсировать ось или нет
     */
    tickMargin?: number;
    /**
     * Функция форматирования значения деления оси.
     */
    tickFormatter?: (value: any, index: number) => string;
    /**
     * Присваивается автоматически в зависимости от переданных данных
     */
    tick?:
        | SVGProps<SVGTextElement>
        | ReactElement<SVGElement>
        | ((props: any) => ReactElement<SVGElement>)
        | boolean;
}
