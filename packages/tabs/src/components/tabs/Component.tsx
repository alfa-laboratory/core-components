import React, { cloneElement } from 'react';
import { PrimaryTablist } from '../primary-tablist';
import { TabsProps } from '../../typings';

export const Tabs = ({
    TabList = PrimaryTablist,
    children,
    selectedId,
    scrollable,
    keepMounted,
    onChange,
}: TabsProps) => {
    const tabsArray = React.Children.toArray(children) as TabsProps['children'];
    const titles = tabsArray.map(({ props: { title, id } }) => ({ title, id }));
    const tabs = tabsArray.filter(
        tab => tab.props.id === selectedId || tab.props.keepMounted || keepMounted,
    );

    return (
        <div>
            <TabList
                titles={titles}
                selectedId={selectedId}
                scrollable={scrollable}
                onChange={onChange}
            />

            {tabs.map(tab => cloneElement(tab, { hidden: tab.props.id !== selectedId }))}
        </div>
    );
};
