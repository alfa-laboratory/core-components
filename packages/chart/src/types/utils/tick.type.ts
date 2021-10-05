import { XAxisProps } from '../xAxis.type';

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
    tickFormatter: (value: number | string) => React.ReactText;
    /*
     * Координата Х
     */
    x: number;
    /*
     * Координата У
     */
    y: number;
    xAxis: XAxisProps;
}
