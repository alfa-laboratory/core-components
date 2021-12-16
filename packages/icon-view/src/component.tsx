import React, { FC } from 'react';

import { SuperEllipse, Circle } from './components';
import { ShapeProps } from './types';

export type IconViewProps = ShapeProps & {
    shape?: 'super-ellipse' | 'circle';
};

const shapeMap = {
    circle: Circle,
    'super-ellipse': SuperEllipse,
};

export const IconView: FC<IconViewProps> = ({ shape = 'super-ellipse', ...restProps }) => {
    const Component = shapeMap[shape];

    return <Component {...restProps} />;
};
