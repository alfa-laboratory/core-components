import React from 'react';
import { TabsProps, Gaps } from '../../typings';
import { PrimaryTabListDesktop } from '../primary-tablist';
import { SecondaryTabListDesktop } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTabListDesktop,
    secondary: SecondaryTabListDesktop,
};

export const TabsDesktop = ({
    view = 'primary',
    scrollable = false,
    gaps = 'default',
    ...restProps
}: Omit<TabsProps, 'TabList'> & Gaps) => {
    const TabList = views[view];

    return <Tabs TabList={<TabList gaps={gaps} />} scrollable={scrollable} {...restProps} />;
};
