import React from 'react';
import { useMedia } from '@alfalab/hooks';
import { PrimaryTabListDesktop } from './Component.desktop';
import { PrimaryTabListMobile } from './Component.mobile';
import { TabListProps, TabsMatchMedia } from '../../typings';

export const PrimaryTabListResponsive = ({
    size,
    defaultMatch = 'desktop',
    ...restProps
}: TabListProps) => {
    const [view] = useMedia<TabsMatchMedia>(
        [
            ['mobile', '(max-width: 767px)'],
            ['desktop', '(min-width: 768px)'],
        ],
        defaultMatch,
    );

    return view === 'desktop' ? (
        <PrimaryTabListDesktop size={size} {...restProps} />
    ) : (
        <PrimaryTabListMobile {...restProps} />
    );
};
