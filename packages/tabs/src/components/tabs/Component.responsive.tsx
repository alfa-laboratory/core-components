import React from 'react';
import { TabsProps, Gaps } from '../../typings';
import { PrimaryTablistResponsive } from '../primary-tablist';
import { SecondaryTablistResponsive } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTablistResponsive,
    secondary: SecondaryTablistResponsive,
};

export const TabsResponsive = ({
    view = 'primary',
    scrollable = false,
    gaps = 'default',
    ...restProps
}: Omit<TabsProps, 'Tablist'> & Gaps) => {
    const Tablist = views[view];

    return <Tabs Tablist={<Tablist gaps={gaps} />} scrollable={scrollable} {...restProps} />;
};
