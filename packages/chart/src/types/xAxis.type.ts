import { AxisProps } from './utils/axis';

export interface XAxisProps extends AxisProps {
    /**
     * Ключ данных, отображаемых на оси.
     */
    dataKey: string | number;
    /**
     * Ориентация оси
     */
    orientation?: 'top' | 'bottom';
    /**
     * Тип деления оси
     */
    tickType?: 'point';
}
