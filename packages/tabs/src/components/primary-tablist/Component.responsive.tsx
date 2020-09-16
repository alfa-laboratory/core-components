import React from 'react';
import { PrimaryTabListDesktop, PrimaryTabListMobile } from './index';
import { TabListProps } from '../../typings';
import { useWindowWidth } from '../../utils';

export const PrimaryTabListResponsive = ({ size, ...restProps }: TabListProps) => {
    return useWindowWidth() >= 768 ? (
        <PrimaryTabListDesktop size={size} {...restProps} />
    ) : (
        <PrimaryTabListMobile {...restProps} />
    );
};
