import React from 'react';
import { TabsProps } from '../../typings';
import { PrimaryTabListMobile } from '../primary-tablist';
import { SecondaryTabListMobile } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTabListMobile,
    secondary: SecondaryTabListMobile,
};

export type TabsMobileProps = Omit<TabsProps, 'TabList'>;

export const TabsMobile = ({
    view = 'primary',
    scrollable = true,
    ...restProps
}: TabsMobileProps) => {
    const TabList = views[view];

    return <Tabs TabList={<TabList />} scrollable={scrollable} {...restProps} />;
};
