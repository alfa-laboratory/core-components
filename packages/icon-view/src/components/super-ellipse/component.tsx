import React, { forwardRef, ReactNode } from 'react';

import { pathsMap } from './paths';
import { BaseShape, BaseShapeProps } from '../base-shape';

export type SuperEllipseProps = Omit<BaseShapeProps, 'pathsMap' | 'size'> & {
    /**
     * Размер компонента
     * @default 64
     */
    size?: 48 | 64 | 80 | 128;

    /**
     * Дочерний компонент
     */
    children?: ReactNode;
};

export const SuperEllipse = forwardRef<HTMLDivElement, SuperEllipseProps>((props, ref) => (
    <BaseShape {...props} pathsMap={pathsMap} ref={ref} />
));
