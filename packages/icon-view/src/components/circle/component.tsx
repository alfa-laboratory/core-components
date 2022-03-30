import React, { forwardRef, ReactNode } from 'react';

import { pathsMap } from './paths';
import { BaseShape, BaseShapeProps } from '../base-shape';

export type CircleProps = Omit<BaseShapeProps, 'pathsMap' | 'size'> & {
    /**
     * Размер компонента
     * @default 64
     */
    size?: 48 | 64 | 80;

    /**
     * Дочерний компонент
     */
    children?: ReactNode;
};

export const Circle = forwardRef<HTMLDivElement, CircleProps>((props, ref) => (
    <BaseShape {...props} pathsMap={pathsMap} ref={ref} />
));
