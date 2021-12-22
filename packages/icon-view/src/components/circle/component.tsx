import React, { FC } from 'react';

import { pathsMap } from './paths';
import { BaseShape, BaseShapeProps } from '../base-shape';

export type CircleProps = Omit<BaseShapeProps, 'pathsMap' | 'size'> & {
    /**
     * Размер компонента
     */
    size?: 48 | 64 | 80;
};

export const Circle: FC<CircleProps> = props => {
    return <BaseShape {...props} pathsMap={pathsMap} />;
};
