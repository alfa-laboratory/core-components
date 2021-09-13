import { ReactText } from 'react';
import { DataKey } from 'recharts/types/util/types';

export interface BrushProps {
    /**
     * Ключ данных
     */
    dataKey?: DataKey<string>;
    /**
     * Ширина ползунков
     */
    travallerWidth?: number;
    /**
     * Начальный индекс интервала показа
     */
    startIndex?: number;
    /**
     * Конечный индекс интервала показа
     */
    endIndex?: number;
    /**
     * Отступ
     */
    brushMargin?: number;
    /**
     * Высота
     */
    height: number;
    /**
     * Форматирование значений
     */
    tickFormatter?: (value: any, index: number) => ReactText;
    /**
     * Всегда показывать значение текущего интервала
     */
    alwaysShowText?: boolean;
    /**
     * Цвевт
     */
    stroke?: string;
}
