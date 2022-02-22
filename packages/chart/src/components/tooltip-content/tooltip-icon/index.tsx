import React from 'react';
import cn from 'classnames';

import { LegendProps } from '../../../types/legend.types';
import { SeriaProps } from '../../../types/seria.types';

import { CircleIcon } from '../../../icons';
import { icons } from '../../legends';

import styles from './index.module.css';

export interface TooltipIconProps {
    data: SeriaProps;
    legend: LegendProps;
}

export const TooltipIcon: React.FC<TooltipIconProps> = ({ data, legend }) => {
    const Icon = (data && data.icon && icons[data.icon]) || CircleIcon;

    return (
        <React.Fragment>
            {Icon ? (
                <i className={cn(styles.legendIcon)}>
                    <Icon
                        fill={data.properties?.fill || data.properties?.stroke || ''}
                        height={legend.iconHeight || 16}
                    />
                </i>
            ) : null}
        </React.Fragment>
    );
};
