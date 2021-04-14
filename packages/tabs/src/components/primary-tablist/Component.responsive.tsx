import React from 'react';
import { useMedia } from '@alfalab/hooks';
import { PrimaryTabListDesktop } from './Component.desktop';
import { PrimaryTabListMobile } from './Component.mobile';
import { TabListProps } from '../../typings';

type View = 'desktop' | 'mobile';

export const PrimaryTabListResponsive = ({ size, ...restProps }: TabListProps) => {
    const [view] = useMedia<View>(
        [
            ['mobile', '(max-width: 767px)'],
            ['desktop', '(min-width: 768px)'],
        ],
        'desktop',
    );

    return view === 'desktop' ? (
        <PrimaryTabListDesktop size={size} {...restProps} />
    ) : (
        <PrimaryTabListMobile {...restProps} />
    );
};
