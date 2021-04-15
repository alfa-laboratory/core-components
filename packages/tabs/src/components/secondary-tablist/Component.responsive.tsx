import React from 'react';
import { useMedia } from '@alfalab/hooks';
import { SecondaryTabListDesktop } from './Component.desktop';
import { SecondaryTabListMobile } from './Component.mobile';
import { SecondaryTabListProps, TabsView } from '../../typings';

export const SecondaryTabListResponsive = ({
    size,
    defaultView = 'desktop',
    ...restProps
}: SecondaryTabListProps) => {
    const [view] = useMedia<TabsView>(
        [
            ['mobile', '(max-width: 767px)'],
            ['desktop', '(min-width: 768px)'],
        ],
        defaultView,
    );

    return view === 'desktop' ? (
        <SecondaryTabListDesktop size={size} {...restProps} />
    ) : (
        <SecondaryTabListMobile {...restProps} />
    );
};
