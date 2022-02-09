import React from 'react';
import { TabsProps } from '../../typings';
import { PrimaryTabListDesktop } from '../primary-tablist/Component.desktop';
import { SecondaryTabListDesktop } from '../secondary-tablist/Component.desktop';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTabListDesktop,
    secondary: SecondaryTabListDesktop,
};

export type TabsDesktopProps = Omit<TabsProps, 'TabList'>;

export const TabsDesktop = ({
    view = 'primary',
    scrollable = false,
    size = view === 'primary' ? 'm' : 's',
    ...restProps
}: TabsDesktopProps) => (
    <Tabs TabList={views[view]} scrollable={scrollable} size={size} {...restProps} />
);
