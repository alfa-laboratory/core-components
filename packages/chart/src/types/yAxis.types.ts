import { AxisProps } from './utils/axis.types';

export interface YAxisProps extends AxisProps {
    /**
     * Ориентация оси
     */
    orientation?: 'left' | 'right';
}
