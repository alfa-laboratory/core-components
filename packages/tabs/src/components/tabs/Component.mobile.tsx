import React from 'react';
import { TabsProps } from '../../typings';
import { PrimaryTablistMobile } from '../primary-tablist';
import { SecondaryTablistMobile } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTablistMobile,
    secondary: SecondaryTablistMobile,
};

export const TabsMobile = ({
    view = 'primary',
    scrollable = true,
    ...restProps
}: Omit<TabsProps, 'Tablist'>) => {
    const Tablist = views[view];

    return <Tabs Tablist={<Tablist />} scrollable={scrollable} {...restProps} />;
};
