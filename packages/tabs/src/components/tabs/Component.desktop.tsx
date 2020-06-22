import React, { useCallback } from 'react';
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
    const renderTablist = useCallback(props => <Tablist {...props} gaps={gaps} />, [gaps]);

    return <Tabs Tablist={renderTablist} scrollable={scrollable} {...restProps} />;
};
