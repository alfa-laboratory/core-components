import { XAxisProps } from '../xAxis.types';

export interface TickProps {
    /*
     * Полезная нагрузка
     */
    payload: {
        /*
         * Координата по оси Х
         */
        coordinate: number;

        /*
         * Значение графика
         */
        value: number;
    };

    /**
     * Функция форматирования
     */
    tickFormatter: (value: number | string) => React.ReactText;

    /*
     * Координата Х
     */
    x: number;

    /*
     * Координата У
     */
    y: number;

    /**
     * Настройки оси Х
     */
    xAxis: XAxisProps;
}
