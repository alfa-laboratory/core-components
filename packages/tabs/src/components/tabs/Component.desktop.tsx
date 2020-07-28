import React from 'react';
import { TabsProps, Gaps } from '../../typings';
import { PrimaryTabListDesktop } from '../primary-tablist';
import { SecondaryTabListDesktop } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTabListDesktop,
    secondary: SecondaryTabListDesktop,
};

export type TabsDesktopProps = Omit<TabsProps, 'TabList'> & Gaps;

export const TabsDesktop = ({
    view = 'primary',
    scrollable = false,
    gaps = 'default',
    ...restProps
}: TabsDesktopProps) => {
    const TabList = views[view];

    return <Tabs TabList={<TabList gaps={gaps} />} scrollable={scrollable} {...restProps} />;
};
