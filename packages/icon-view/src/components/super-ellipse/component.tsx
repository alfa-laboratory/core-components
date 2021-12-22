import React, { FC } from 'react';

import { pathsMap } from './paths';
import { BaseShape, BaseShapeProps } from '../base-shape';

export type SuperEllipseProps = Omit<BaseShapeProps, 'pathsMap' | 'size'> & {
    /**
     * Размер компонента
     */
    size?: 48 | 64 | 80 | 128;
};

export const SuperEllipse: FC<SuperEllipseProps> = props => {
    return <BaseShape {...props} pathsMap={pathsMap} />;
};
