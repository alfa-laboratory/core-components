import React from 'react';
import { SecondaryTabListDesktop } from './Component.desktop';
import { SecondaryTabListMobile } from './Component.mobile';
import { SecondaryTabListProps } from '../../typings';
import { useResponsiveComponent, TABS_BREAK_POINT } from '../../utils';

export const SecondaryTabListResponsive = ({
    size,
    defaultMatch,
    ...restProps
}: SecondaryTabListProps) => {
    const SecondaryTabList = useResponsiveComponent({
        defaultMatch,
        breakPoint: TABS_BREAK_POINT,
        desktop: <SecondaryTabListDesktop size={size} {...restProps} />,
        mobile: <SecondaryTabListMobile {...restProps} />,
    });

    return SecondaryTabList;
};
