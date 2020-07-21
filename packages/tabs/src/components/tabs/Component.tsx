import React, { cloneElement } from 'react';
import { TabsProps } from '../../typings';

export const Tabs = ({
    Tablist,
    children,
    selectedId,
    scrollable,
    keepMounted = false,
    onChange,
}: Omit<TabsProps, 'view'>) => {
    const tabsArray = React.Children.toArray(children) as TabsProps['children'];
    const titles = tabsArray.map(({ props: { title, id } }) => ({ title, id }));
    const tabs = tabsArray.filter(
        tab => tab.props.id === selectedId || tab.props.keepMounted || keepMounted,
    );

    return (
        <div>
            {cloneElement(Tablist, {
                titles,
                selectedId,
                scrollable,
                onChange,
            })}

            {tabs.map(tab => cloneElement(tab, { hidden: tab.props.id !== selectedId }))}
        </div>
    );
};
