import React from 'react';
import { TabsProps } from '../../typings';
import { PrimaryTabListDesktop } from '../primary-tablist';
import { SecondaryTabListDesktop } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTabListDesktop,
    secondary: SecondaryTabListDesktop,
};

export type TabsDesktopProps = Omit<TabsProps, 'TabList'>;

export const TabsDesktop = ({
    view = 'primary',
    scrollable = false,
    size = 'm',
    ...restProps
}: TabsDesktopProps) => (
    <Tabs TabList={views[view]} scrollable={scrollable} size={size} {...restProps} />
);
