import React from 'react';
import { useMedia } from '@alfalab/hooks';
import { PrimaryTabListDesktop } from './Component.desktop';
import { PrimaryTabListMobile } from './Component.mobile';
import { TabListProps, TabsView } from '../../typings';

export const PrimaryTabListResponsive = ({
    size,
    defaultView = 'desktop',
    ...restProps
}: TabListProps) => {
    const [view] = useMedia<TabsView>(
        [
            ['mobile', '(max-width: 767px)'],
            ['desktop', '(min-width: 768px)'],
        ],
        defaultView,
    );

    return view === 'desktop' ? (
        <PrimaryTabListDesktop size={size} {...restProps} />
    ) : (
        <PrimaryTabListMobile {...restProps} />
    );
};
