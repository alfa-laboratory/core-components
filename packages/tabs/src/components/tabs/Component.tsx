import React, { cloneElement } from 'react';

import { TabsProps } from '../../typings';

export const Tabs = ({
    TabList,
    className,
    containerClassName,
    size,
    defaultMatch,
    children,
    selectedId,
    scrollable,
    keepMounted = false,
    dataTestId,
    onChange,
}: Omit<TabsProps, 'view'>) => {
    const tabsArray = React.Children.toArray(children) as TabsProps['children'];
    const titles = tabsArray.map(({ props: { title, id, rightAddons, disabled, hidden } }) => ({
        title,
        id,
        disabled,
        rightAddons,
        hidden,
    }));
    const tabs = tabsArray.filter(
        tab => tab.props.id === selectedId || tab.props.keepMounted || keepMounted,
    );

    return (
        <div className={className}>
            <TabList
                containerClassName={containerClassName}
                size={size}
                titles={titles}
                selectedId={selectedId}
                scrollable={scrollable}
                onChange={onChange}
                dataTestId={dataTestId}
                defaultMatch={defaultMatch}
            />

            {tabs.map(tab => cloneElement(tab, { hidden: tab.props.id !== selectedId }))}
        </div>
    );
};
