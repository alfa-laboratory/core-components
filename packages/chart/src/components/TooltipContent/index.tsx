import React from 'react';
import cn from 'classnames';
import { TextProps, Typography } from '@alfalab/core-components-typography';

import { TooltipIcon } from './tooltip-icon';
import { TooltipName } from './tooltip-name';
import { TooltipValue } from './tooltip-value';

import { LegendProps } from '../../types/legend.types';
import { PayloadProps } from '../../types/payload.types';
import { SeriaProps } from '../../types/seria.types';
import { TooltipProps } from '../../types/tooltip.types';

import styles from './index.module.css';

export interface TooltipContentProps extends TooltipProps {
    payload: PayloadProps[];
    series: SeriaProps[];
    legend: LegendProps;
    tooltip: TooltipProps;
}

export interface JSXElementObject {
    [name: string]: JSX.Element;
}

export const TooltipContent = ({
    payload,
    separator,
    label,
    tooltipArrowSide,
    arrow,
    series,
    labelFormatter,
    labelStyle,
    amount,
    legend,
    tooltip,
}: TooltipContentProps) => {
    if (!label || payload.length === 0) return null;
    const title: TextProps = tooltip?.typography?.title ?? {
        view: 'component',
        weight: 'medium',
        tag: 'span',
    };

    const text: TextProps = tooltip?.typography?.text ?? {
        view: 'component',
        tag: 'span',
    };

    const list = tooltip.arrangeData ?? ['name', 'value'];

    return (
        <div className={cn(styles.tooltip)}>
            {arrow && (
                <span
                    className={cn(
                        styles.tooltipArrow,
                        tooltipArrowSide ? '' : styles.tooltipArrowRight,
                    )}
                />
            )}
            <ul className={cn(styles.tooltipList)}>
                <li className={cn(styles.tooltipItem)} style={labelStyle}>
                    <Typography.Text {...title} className={cn(styles.tooltipLabel)}>
                        {labelFormatter ? labelFormatter(label) : label}
                    </Typography.Text>
                </li>
                {payload.map((entry: PayloadProps) => {
                    const data: SeriaProps | undefined = series.find(
                        (d: SeriaProps) => d.properties.dataKey === entry.dataKey,
                    );

                    if (!data || data?.hideTooltip || data?.hide) return null;

                    const components: JSXElementObject = {
                        icon: <TooltipIcon key='icon' data={data} legend={legend} />,
                        name: (
                            <TooltipName
                                key='name'
                                list={list}
                                separator={separator}
                                entry={entry}
                                text={text}
                            />
                        ),
                        value: (
                            <TooltipValue key='value' amount={amount} entry={entry} text={text} />
                        ),
                    };

                    return (
                        <li className={cn(styles.tooltipItem)} key={entry.dataKey}>
                            {list.map((item: string) => components[item])}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
