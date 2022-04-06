import React from 'react';
import { GradientProps, LinearGradientProps } from '../../types/utils/gradient.types';

export const LinearGradient = ({ id, gid, points }: LinearGradientProps): React.ReactElement => {
    return (
        <linearGradient key={`${id}-${gid}`} id={`${id}-${gid}`} x1='0' y1='0' x2='0' y2='1'>
            {points.map((point: GradientProps, index: number) => (
                <stop
                    key={`${id}${gid}-${index.toString()}`}
                    offset={`${point.offset}%`}
                    stopColor={point.stopColor}
                    stopOpacity={point.stopOpacity}
                />
            ))}
        </linearGradient>
    );
};
