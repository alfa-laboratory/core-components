import React from 'react';
import { useMedia } from '@alfalab/hooks';
import { SecondaryTabListDesktop } from './Component.desktop';
import { SecondaryTabListMobile } from './Component.mobile';
import { SecondaryTabListProps, TabsMatchMedia } from '../../typings';

export const SecondaryTabListResponsive = ({
    size,
    defaultMatch = 'desktop',
    ...restProps
}: SecondaryTabListProps) => {
    const [view] = useMedia<TabsMatchMedia>(
        [
            ['mobile', '(max-width: 767px)'],
            ['desktop', '(min-width: 768px)'],
        ],
        defaultMatch,
    );

    return view === 'desktop' ? (
        <SecondaryTabListDesktop size={size} {...restProps} />
    ) : (
        <SecondaryTabListMobile {...restProps} />
    );
};
