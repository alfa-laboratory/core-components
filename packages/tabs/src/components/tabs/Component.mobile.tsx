import React from 'react';
import { TabsProps } from '../../typings';
import { PrimaryTabListMobile } from '../primary-tablist/Component.mobile';
import { SecondaryTabListMobile } from '../secondary-tablist/Component.mobile';
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
