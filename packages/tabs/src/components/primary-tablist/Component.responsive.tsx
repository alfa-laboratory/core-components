import React from 'react';
import { PrimaryTabListDesktop } from './Component.desktop';
import { PrimaryTabListMobile } from './Component.mobile';
import { TabListProps } from '../../typings';
import { useResponsiveComponent, TABS_BREAK_POINT } from '../../utils';

export const PrimaryTabListResponsive = ({
    size,
    defaultMatch = 'mobile',
    ...restProps
}: TabListProps) => {
    const PrimaryTabList = useResponsiveComponent({
        defaultMatch,
        breakPoint: TABS_BREAK_POINT,
        desktop: <PrimaryTabListDesktop size={size} {...restProps} />,
        mobile: <PrimaryTabListMobile {...restProps} />,
    });

    return PrimaryTabList;
};
