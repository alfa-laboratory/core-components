import React, { useCallback } from 'react';
import { TabsProps, Gaps } from '../../typings';
import { PrimaryTablistResponsive } from '../primary-tablist';
import { SecondaryTablistResponsive } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTablistResponsive,
    secondary: SecondaryTablistResponsive,
};

export type TabsResponsiveProps = Omit<TabsProps, 'Tablist'> & Gaps;

export const TabsResponsive = ({
    view = 'primary',
    scrollable = false,
    gaps = 'default',
    ...restProps
}: TabsResponsiveProps) => {
    const Tablist = views[view];
    const renderTablist = useCallback(props => <Tablist {...props} gaps={gaps} />, [gaps]);

    return <Tabs Tablist={renderTablist} scrollable={scrollable} {...restProps} />;
};
