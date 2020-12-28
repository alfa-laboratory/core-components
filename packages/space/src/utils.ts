import React from 'react';

export type Align = 'start' | 'end' | 'center';
export type Direction = 'horizontal' | 'vertical';
export type Size = 's' | 'm' | 'l' | number;

export const SpaceContext = React.createContext({
    length: 0,
    horizontalSize: 0,
    verticalSize: 0,
});
