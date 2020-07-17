import React from 'react';
import { TabsProps } from '../../typings';
import { PrimaryTablistMobile } from '../primary-tablist';
import { SecondaryTablistMobile } from '../secondary-tablist';
import { Tabs } from './Component';

const views = {
    primary: PrimaryTablistMobile,
    secondary: SecondaryTablistMobile,
};

export type TabsMobileProps = Omit<TabsProps, 'Tablist'>;

export const TabsMobile = ({
    view = 'primary',
    scrollable = true,
    ...restProps
}: TabsMobileProps) => {
    const Tablist = views[view];

    return <Tabs Tablist={Tablist} scrollable={scrollable} {...restProps} />;
};
