import { AxisProps } from './utils/axis';

export interface YAxisProps extends AxisProps {
    /**
     * Ориентация оси
     */
    orientation?: 'left' | 'right';
}
