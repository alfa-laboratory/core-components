import React from 'react';
import cn from 'classnames';
import { Typography } from '@alfalab/core-components-typography';
import { LegendComponentProps } from '../../types/legend.type';
import { SeriaProps } from '../../types/seria.type';

// icons
import CircleIcon from '../../icons/Circle.icon';
import CircleLineIcon from '../../icons/CircleLine.icon';
import FilledCircleIcon from '../../icons/FilledCircle.icon';
import StrokeCircleIcon from '../../icons/StrokeCircle.icon';

import styles from './index.module.css';

const Legends = React.forwardRef<HTMLUListElement, LegendComponentProps>(
    ({ legend, series, id, charts, toggleChart }, ref): React.ReactElement => {
        const style: React.CSSProperties = {
            textAlign: legend.align || 'center',
            transform: `translateY(${(legend?.marginTop ? legend.marginTop : 0) *
                (legend.verticalAlign === 'top' ? -1 : 1)}px)`,
        };

        const getIcon = (type: string) => {
            switch (type) {
                case 'circleLine':
                    return CircleLineIcon;
                case 'filledCircle':
                    return FilledCircleIcon;
                case 'strokeCircle':
                    return StrokeCircleIcon;
                case 'circle':
                default:
                    return CircleIcon;
            }
        };

        return (
            <ul ref={ref} className={cn(styles.legendWrap)} style={style}>
                {series.map((item: SeriaProps) => {
                    if (item.hideLegend || item.hide) return null;

                    const Icon = getIcon(item.icon);
                    return (
                        <li
                            role='presentation'
                            key={`${id}-${item.properties.dataKey}`}
                            className={cn(
                                styles.legendItem,
                                charts[`${item.properties.dataKey}`] ? '' : styles.legendUnactive,
                            )}
                            onClick={() => toggleChart(item)}
                        >
                            <div className={cn(styles.legendContent)}>
                                {Icon ? (
                                    <i className={cn(styles.legendIcon)}>
                                        <Icon
                                            fill={
                                                item.properties?.fill ||
                                                item.properties?.stroke ||
                                                ''
                                            }
                                        />
                                    </i>
                                ) : null}
                                <Typography.Text
                                    view='primary-medium'
                                    tag='span'
                                    className={cn(styles.legendValue)}
                                >
                                    {item.properties.name}
                                </Typography.Text>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    },
);

export default Legends;
