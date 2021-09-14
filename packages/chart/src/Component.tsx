import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import cn from 'classnames';
import {
    ResponsiveContainer,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    ComposedChart,
    Cell,
    Area,
    Brush,
} from 'recharts';

import CustomizedHOC from './hoc/Customized.hoc';
import LinearGradient from './components/LinearGradient';
import Legends from './components/Legends';
import Dot from './components/Dot';

import { SeriaProps } from './types/seria.type';
import { CustomLegendProps } from './types/legend.type';
import { ChartsProps } from './types/charts.type';
import { ChartProps, ToggleChartProps } from './types/chart.type';
import { DataDynamicProps, DataProps, DataDynamicBooleanProps } from './types/utils/data.type';
import { ActiveDotProps } from './types/utils/dot.type';
import { CoordinatesProps } from './types/utils/coordinates.type';

import Tick from './components/Tick';
import TooltipContent from './components/TooltipContent';

import styles from './index.module.css';

interface ChartsPropsTypes {
    options: ChartsProps;
}

const Chart = ({ options }: ChartsPropsTypes) => {
    const [state, setState] = useState<ChartsProps | null>(null);
    const [activeDotsState, setActiveDotsState] = useState<ActiveDotProps>({
        prev: null,
        active: null,
    });

    const [yBrush, setYBrush] = useState<number | null>(null);
    const [data, setData] = useState<DataDynamicProps[]>([]);
    const [tooltipArrowSide, setTooltipArrowSide] = useState<boolean | null>(null);
    const [charts, setCharts] = useState<DataDynamicBooleanProps>({});
    const [filterCount, setFilterCount] = useState<number>(0);
    const [heightLegend, setHeightLegend] = useState<number>(0);

    const svgRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<any>(null);

    const renderGradient = useMemo(() => {
        if (!state) return null;
        return state.series.map((item: SeriaProps) => {
            const { chart, gradient } = item;
            if (chart !== 'gradient' || !gradient) return null;
            const { gid, points } = gradient;
            return (
                <LinearGradient
                    key={`${state.id}-${gid}`}
                    id={state.id}
                    gid={gid}
                    points={points}
                />
            );
        });
    }, [state]);

    const toggleChart = useCallback(
        (item: ToggleChartProps): void => {
            const {
                chart,
                properties: { dataKey },
            } = item;

            const withGrad = chart === 'area';
            let changed = false;

            if (charts[`${dataKey}`] && filterCount > 1) {
                changed = true;
                setFilterCount(prev => prev - 1);
            }
            if (!charts[`${dataKey}`]) {
                changed = true;
                setFilterCount(prev => prev + 1);
            }
            if (!changed) return;
            setCharts((prev: DataDynamicBooleanProps) => {
                const newState = { ...prev };
                newState[`${dataKey}`] = !newState[`${dataKey}`];
                if (withGrad) newState[`${dataKey}-gradient`] = !newState[`${dataKey}-gradient`];
                return newState;
            });
        },
        [charts, filterCount],
    );

    const legendRef = useCallback((node: HTMLUListElement): void => {
        if (node !== null) {
            setTimeout(() => {
                const h = node.getBoundingClientRect().height;
                setHeightLegend(h);
            }, 0);
        }
    }, []);

    const CustomLegend = useCallback(
        (props: CustomLegendProps): React.ReactElement => {
            return (
                <Legends
                    legend={props.legend}
                    series={props.series}
                    id={props.id}
                    toggleChart={toggleChart}
                    ref={legendRef}
                    charts={charts}
                />
            );
        },
        [charts, toggleChart, legendRef],
    );

    const renderLegend = useMemo((): React.ReactElement | null => {
        if (!state?.legend) return null;
        return (
            <Legend
                {...(state.legend || null)}
                content={CustomLegend({ legend: state.legend, series: state.series, id: state.id })}
                wrapperStyle={{
                    transform: `translateY(${
                        state?.xAxis?.tickMargin && state?.legend?.verticalAlign !== 'top'
                            ? `${state.xAxis.tickMargin +
                                  (state?.brush?.brushMargin ? state.brush.brushMargin : 0)}px`
                            : 0
                    })`,
                }}
            />
        );
    }, [state, CustomLegend]);

    const RenderLine = useCallback(
        (properties: ChartProps): React.ReactElement | null => {
            if (!state || !properties) return null;
            return (
                <Line
                    key={`${state.id}-${properties.dataKey}`}
                    {...properties}
                    dot={
                        properties.dot && properties.dotSettings
                            ? CustomizedHOC(Dot, {
                                  activeDot: activeDotsState.active,
                                  dotSettings: properties.dotSettings,
                                  inherit: properties?.inheritStroke
                                      ? properties.inheritStroke
                                      : false,
                                  // SvgIcon: properties.dot, // Возможность передать кастомную иконку, статус: Доработать
                              })
                            : false
                    }
                    activeDot={false}
                />
            );
        },
        [activeDotsState.active, state],
    );

    const RenderBar = useCallback(
        (properties: ChartProps) => {
            if (!state) return null;
            return (
                <Bar key={`${state.id}-${properties.dataKey}`} {...properties}>
                    {data.map((entry: DataDynamicProps, index: number) => {
                        const key = `${state.id}-${properties.dataKey}-${index}`;
                        return (
                            <Cell
                                key={key}
                                className={cn(
                                    styles.bar,
                                    typeof activeDotsState.active === 'number' &&
                                        activeDotsState.active !== index
                                        ? styles.barUnfocused
                                        : '',
                                )}
                            />
                        );
                    })}
                </Bar>
            );
        },
        [activeDotsState, data, state],
    );

    const RenderArea = useCallback(
        (props: SeriaProps) => {
            const {
                gradient: { gid = '' } = {},
                properties = {},
                properties: { fill = '', dataKey } = {},
            } = props;

            if (state) {
                return (
                    <Area
                        {...properties}
                        key={`${state.id}-${dataKey}`}
                        dataKey={`${dataKey}`}
                        stroke='transparent'
                        fill={gid ? `url(#${state.id}-${gid})` : fill}
                        dot={false}
                        activeDot={false}
                    />
                );
            }
            return null;
        },
        [state],
    );

    const renderCartesianGrid = useMemo((): React.ReactElement | null => {
        if (!state?.cartesianGrid) return null;
        return <CartesianGrid {...state.cartesianGrid} />;
    }, [state]);

    const renderXAxis = useMemo((): React.ReactElement | null => {
        if (!state?.xAxis) return null;
        let tick;
        if (state?.xAxis?.tickType === 'point') {
            tick = CustomizedHOC(Tick, { xAxis: state.xAxis });
        } else if (typeof state.xAxis.tick === 'boolean') {
            tick = state.xAxis.tick;
        } else {
            tick = true;
        }

        return <XAxis {...state.xAxis} tick={tick} />;
    }, [state]);

    const renderYAxis = useMemo((): React.ReactElement | null => {
        if (!state?.yAxis) return null;
        let tick;
        if (state?.yAxis?.tick) {
            tick = CustomizedHOC(state.yAxis.tick, { state });
        } else if (typeof state.yAxis.tick === 'boolean') {
            tick = state.yAxis.tick;
        } else {
            tick = true;
        }

        return <YAxis {...state.yAxis} tick={tick} />;
    }, [state]);

    const renderBrush = useMemo((): React.ReactElement | null => {
        if (!state?.brush) return null;
        return <Brush y={typeof yBrush === 'number' ? yBrush : 0} {...state.brush} />;
    }, [state, yBrush]);

    const renderTooltip = useMemo((): React.ReactElement | null => {
        if (!state?.tooltip) return null;
        return (
            <Tooltip
                ref={tooltipRef}
                {...state.tooltip}
                content={CustomizedHOC(TooltipContent, { series: state.series, tooltipArrowSide })}
            />
        );
    }, [state, tooltipArrowSide]);

    const renderChartsItems = useMemo(() => {
        if (!state || !charts) return null;
        return state.series.map((item: SeriaProps) => {
            const { chart, properties } = item;
            const show = charts[`${properties.dataKey}`];

            switch (chart) {
                case 'bar':
                    return show && !item?.hide ? RenderBar(properties) : null;

                case 'area':
                case 'line':
                    return show && !item?.hide ? RenderLine(properties) : null;

                case 'gradient':
                    return show && !item?.hide ? RenderArea(item) : null;

                default:
                    return null;
            }
        });
    }, [RenderArea, RenderBar, RenderLine, charts, state]);

    useEffect(() => {
        return () => {
            setData([]);
            setCharts({});
            setFilterCount(0);
            setState(null);
        };
    }, []);

    // Позиционирование brush
    useEffect(() => {
        if (!state || !state.brush) return;
        if (!heightLegend || heightLegend === 0) return;
        const align = state?.legend?.verticalAlign;
        const legendHeight = align === 'top' ? 0 : heightLegend;
        const marginTick = state?.xAxis?.tickMargin ? state?.xAxis?.tickMargin : 0;
        const brushY =
            (svgRef.current?.clientHeight ? svgRef.current.clientHeight : 0) -
            legendHeight -
            state.brush.height -
            (state?.composeChart?.margin?.bottom ? state.composeChart.margin.bottom : 0) +
            marginTick +
            (state.brush?.brushMargin ? state.brush.brushMargin : 0);
        setYBrush(brushY);
    }, [heightLegend, state]);

    useEffect(() => {
        const initData: DataDynamicProps[] = [];
        const chartsNames: DataDynamicBooleanProps = {};
        const settings: ChartsProps = options;
        let count = 0;

        if (typeof settings?.brush?.brushMargin === 'number') {
            if (settings?.legend && settings?.legend?.verticalAlign !== 'top') {
                settings.legend.margin = {
                    top: settings.legend?.marginTop
                        ? settings.legend.marginTop +
                          (settings?.brush?.brushMargin ? settings.brush.brushMargin : 0)
                        : settings?.brush?.brushMargin,
                };
            } else if (settings?.legend && settings?.legend?.verticalAlign === 'top') {
                settings.legend.margin = {
                    top: settings.legend.marginTop ? Number(settings.legend.marginTop * -1) : 0,
                };
            }
        }

        const filterSeries = settings.series.filter(item => item.chart !== 'gradient');

        const newOptionsSeries = filterSeries.reduce((accum: SeriaProps[], item: SeriaProps) => {
            const { chart, data: dataSeria, offset, fill } = item;
            if (chart === 'area') {
                let newData = null;
                if (offset) {
                    newData = dataSeria.map((d: DataProps) => {
                        const { label, value } = d;
                        return {
                            label,
                            value: Math.ceil(value - value * offset),
                        };
                    });
                }

                const obj = {
                    ...item,
                    zIndex: -100,
                    chart: 'gradient' as const,
                    hideLegend: true,
                    hideTooltip: true,
                    properties: {
                        ...item.properties,
                        dataKey: `${item.properties.dataKey}-gradient`,
                        fill,
                    },
                    data: newData || item.data,
                };
                accum.push(obj);
            }
            accum.push(item);
            return accum;
        }, []);

        settings.series = newOptionsSeries;

        for (let i = 0; i < settings.series.length; i++) {
            const {
                properties: { dataKey = '' } = {},
                data: seriaData = [],
                hideLegend,
                hide,
            } = settings.series[i];

            if (!hideLegend && !hide) count += 1;

            settings.labels.map((label: string | number) => {
                const item = seriaData.find((d: DataProps) => d.label === label);

                if (item) {
                    const obj: DataDynamicProps = {
                        label,
                    };
                    obj[`${dataKey}`] = item.value;

                    if (!chartsNames[`${dataKey}`]) chartsNames[`${dataKey}`] = true;

                    const index = initData
                        .map((dataItem: DataDynamicProps) => dataItem.label)
                        .indexOf(label);
                    if (index === -1) initData.push(obj);
                    else initData[index] = { ...initData[index], ...obj };
                }

                return null;
            });
        }

        settings.composeChart.margin = {
            ...settings.composeChart.margin,
            top:
                (settings?.composeChart?.initMargin?.top
                    ? settings.composeChart.initMargin.top
                    : 0) +
                (settings?.legend?.verticalAlign === 'top' && settings?.legend?.marginTop
                    ? Math.abs(settings.legend.marginTop)
                    : 0),
            bottom:
                (settings?.composeChart?.initMargin?.bottom
                    ? settings.composeChart.initMargin.bottom
                    : 0) +
                (settings?.xAxis?.tickMargin ? settings.xAxis.tickMargin : 0) +
                (settings?.brush?.brushMargin ? settings.brush.brushMargin : 0) +
                (settings?.legend?.verticalAlign !== 'top' && settings?.legend?.marginTop
                    ? settings.legend.marginTop
                    : 0),
            left: settings?.composeChart?.initMargin?.left
                ? settings.composeChart.initMargin.left
                : 0,
            right: settings?.composeChart?.initMargin?.right
                ? settings.composeChart.initMargin.right
                : 0,
        };

        settings.series = settings.series.sort((a: SeriaProps, b: SeriaProps) => {
            if (a?.zIndex && b?.zIndex && a?.zIndex > b?.zIndex) {
                return 1;
            }
            return -1;
        });

        setState(settings);
        setData(initData);
        setCharts(chartsNames);
        setFilterCount(count);
    }, [options]);

    const leaveEvent = (isTooltipActive: boolean): void => {
        if (!isTooltipActive) {
            if (
                typeof activeDotsState.prev !== 'number' ||
                typeof activeDotsState.active !== 'number'
            )
                return;
            setActiveDotsState({
                prev: null,
                active: null,
            });
        }
    };

    const arrowTooltipEvent = (activeCoordinate: CoordinatesProps): void => {
        if (!state?.tooltip?.arrow) return;
        if (state?.tooltip?.arrow && activeCoordinate?.x) {
            const side =
                (svgRef.current?.clientWidth ? svgRef.current?.clientWidth : 0) -
                    (state?.composeChart?.margin?.right ? state.composeChart.margin.right : 0) -
                    activeCoordinate.x -
                    (tooltipRef.current?.state?.boxWidth ? tooltipRef.current.state.boxWidth : 0) >
                20;
            setTooltipArrowSide(side);
        }
    };

    const hoverEvent = (isTooltipActive: boolean, activeTooltipIndex: number | undefined): void => {
        if (!isTooltipActive) return;
        if (
            typeof activeDotsState.active === 'number' &&
            activeTooltipIndex === activeDotsState.active
        )
            return;
        if (typeof activeTooltipIndex === 'number' && typeof activeDotsState.active !== 'number') {
            const next = {
                prev: activeTooltipIndex,
                active: activeTooltipIndex,
            };
            setActiveDotsState(next);
        }

        if (typeof activeTooltipIndex === 'number' && typeof activeDotsState.prev === 'number') {
            setActiveDotsState((prev: ActiveDotProps) => {
                const prevValue = prev.active;
                const next = {
                    prev: prevValue,
                    active: activeTooltipIndex,
                };
                return next;
            });
        }
    };

    const mouseMove = (e: any): void => {
        arrowTooltipEvent(e.activeCoordinate);
        hoverEvent(e.isTooltipActive, e.activeTooltipIndex);
        leaveEvent(e.isTooltipActive);
    };

    const mouseLeave = (e: any): void => {
        leaveEvent(e.isTooltipActive);
    };

    if (!data || !charts || !state) return null;

    return (
        <div ref={svgRef} id={state?.id || ''} style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer
                debounce={
                    state?.responsiveContainer?.debounce ? state.responsiveContainer.debounce : 0
                }
                width='100%'
            >
                <ComposedChart
                    {...state?.composeChart}
                    onMouseMove={mouseMove}
                    onMouseLeave={mouseLeave}
                    data={data}
                >
                    <defs>{renderGradient}</defs>
                    {state.cartesianGrid && renderCartesianGrid}
                    {state.xAxis && renderXAxis}
                    {state.yAxis && renderYAxis}
                    {renderChartsItems}
                    {state.tooltip && renderTooltip}
                    {state.brush && renderBrush}
                    {state.legend && renderLegend}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default React.memo(Chart);