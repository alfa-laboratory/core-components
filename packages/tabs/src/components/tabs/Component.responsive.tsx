import React from 'react';
import { TabsProps, Gaps } from '../../typings';
import { PrimaryTabListResponsive } from '../primary-tablist';
import { SecondaryTabListResponsive } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTabListResponsive,
    secondary: SecondaryTabListResponsive,
};

export const TabsResponsive = ({
    view = 'primary',
    scrollable = false,
    gaps = 'default',
    ...restProps
}: Omit<TabsProps, 'TabList'> & Gaps) => {
    const TabList = views[view];

    return <Tabs TabList={<TabList gaps={gaps} />} scrollable={scrollable} {...restProps} />;
};
