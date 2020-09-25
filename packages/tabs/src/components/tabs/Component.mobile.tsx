import React from 'react';
import { TabsProps } from '../../typings';
import { PrimaryTabListMobile } from '../primary-tablist';
import { SecondaryTabListMobile } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTabListMobile,
    secondary: SecondaryTabListMobile,
};

export type TabsMobileProps = Omit<TabsProps, 'TabList' | 'size'>;

export const TabsMobile = ({
    view = 'primary',
    scrollable = true,
    ...restProps
}: TabsMobileProps) => <Tabs TabList={views[view]} scrollable={scrollable} {...restProps} />;
