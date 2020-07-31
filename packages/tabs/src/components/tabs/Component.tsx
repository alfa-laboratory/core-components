import React, { cloneElement } from 'react';
import { TabsProps } from '../../typings';

export const Tabs = ({
    TabList,
    className,
    children,
    selectedId,
    scrollable,
    keepMounted = false,
    dataTestId,
    onChange,
}: Omit<TabsProps, 'view'>) => {
    const tabsArray = React.Children.toArray(children) as TabsProps['children'];
    const titles = tabsArray.map(({ props: { title, id } }) => ({ title, id }));
    const tabs = tabsArray.filter(
        tab => tab.props.id === selectedId || tab.props.keepMounted || keepMounted,
    );

    return (
        <div className={className}>
            {cloneElement(TabList, {
                titles,
                selectedId,
                scrollable,
                onChange,
                dataTestId,
            })}

            {tabs.map(tab => cloneElement(tab, { hidden: tab.props.id !== selectedId }))}
        </div>
    );
};
