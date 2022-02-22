import { XAxisProps } from '../../../types/xAxis.types';
import { BrushProps } from '../../../types/brush.types';
import { LegendProps } from '../../../types/legend.types';
import { ComposedChartProps } from '../../../types/composedChart.types';

type ComposedChartsMarginResultProps = {
    top: number;
    bottom: number;
    left: number;
    right: number;
};

export const setComposedChartsMargin = (
    composeChart: ComposedChartProps,
    legend: LegendProps | undefined,
    brush: BrushProps | undefined,
    xAxis: XAxisProps,
): ComposedChartsMarginResultProps => {
    return {
        top:
            (composeChart?.initMargin?.top || 0) +
            (legend?.verticalAlign === 'top' && legend?.marginTop ? Math.abs(legend.marginTop) : 0),
        bottom:
            (composeChart?.initMargin?.bottom || 0) +
            (xAxis?.tickMargin || 0) +
            (brush?.brushMargin || 0) +
            (legend?.verticalAlign !== 'top' && legend?.marginTop ? legend.marginTop : 0),
        left: composeChart?.initMargin?.left || 0,
        right: composeChart?.initMargin?.right || 0,
    };
};
