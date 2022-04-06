import { TextProps } from '@alfalab/core-components-typography';
import { Formatter } from 'recharts/types/component/DefaultLegendContent';

export interface LegendProps {
    /**
     * Выравнивание элементов легенды в вертикальном направлении
     */
    verticalAlign?: 'top' | 'middle' | 'bottom';

    /**
     * Функция форматирования каждого текста в легенде
     */
    formatter?: Formatter;

    /**
     * Выравнивание элементов легенды в горизонтальном направлении
     */
    align?: 'left' | 'center' | 'right';

    /**
     * Вертикальный отступ
     */
    marginTop?: number;

    /**
     * Выщитывается автоматически
     */
    margin?: {
        top?: number;
    };

    /**
     * Высота иконок
     */
    iconHeight?: number;

    /**
     * Пропсы для Typography.Text легенд
     */
    typography?: {
        label: TextProps;
    };
}
