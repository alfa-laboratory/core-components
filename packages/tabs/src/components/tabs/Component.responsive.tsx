import React from 'react';
import { TabsProps } from '../../typings';
import { PrimaryTabListResponsive } from '../primary-tablist/Component.responsive';
import { SecondaryTabListResponsive } from '../secondary-tablist/Component.responsive';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTabListResponsive,
    secondary: SecondaryTabListResponsive,
};

export type TabsResponsiveProps = Omit<TabsProps, 'TabList'>;

export const TabsResponsive = ({
    view = 'primary',
    scrollable = false,
    ...restProps
}: TabsResponsiveProps) => <Tabs TabList={views[view]} scrollable={scrollable} {...restProps} />;
