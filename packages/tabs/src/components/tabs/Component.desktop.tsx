import React from 'react';
import { TabsProps, Gaps } from '../../typings';
import { PrimaryTablistDesktop } from '../primary-tablist';
import { SecondaryTablistDesktop } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTablistDesktop,
    secondary: SecondaryTablistDesktop,
};

export const TabsDesktop = ({
    view = 'primary',
    scrollable = false,
    gaps = 'default',
    ...restProps
}: Omit<TabsProps, 'Tablist'> & Gaps) => {
    const Tablist = views[view];

    return <Tabs Tablist={<Tablist gaps={gaps} />} scrollable={scrollable} {...restProps} />;
};
