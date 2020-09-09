import React, { cloneElement } from 'react';
import { TabsProps } from '../../typings';

export const Tabs = ({
    TabList,
    className,
    size,
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
            <TabList
                size={size}
                titles={titles}
                selectedId={selectedId}
                scrollable={scrollable}
                onChange={onChange}
                dataTestId={dataTestId}
            />

            {tabs.map(tab => cloneElement(tab, { hidden: tab.props.id !== selectedId }))}
        </div>
    );
};
