import React from 'react';
import cn from 'classnames';
import { Tag } from '@alfalab/core-components-tag';
import { ScrollableContainer } from '../scrollable-container';
import { SecondaryTabListProps, Styles } from '../../typings';
import { useTabs } from '../../useTabs';

export const SecondaryTabList = ({
    styles = {},
    className,
    containerClassName,
    size,
    titles = [],
    selectedId = titles.length ? titles[0].id : undefined,
    scrollable = true,
    tagSize = 'xs',
    onChange,
    dataTestId,
}: SecondaryTabListProps & Styles) => {
    const { focusedTab, selectedTab, getTabListItemProps } = useTabs({
        titles,
        selectedId,
        onChange,
    });

    const renderContent = () =>
        titles
            .filter(item => !item.hidden)
            .map((item, index) => (
                <Tag
                    {...getTabListItemProps(index)}
                    key={item.id}
                    className={styles.title}
                    checked={item.id === selectedId}
                    size={tagSize}
                    rightAddons={item.rightAddons}
                >
                    {item.title}
                </Tag>
            ));

    return (
        <div
            role='tablist'
            data-test-id={dataTestId}
            className={cn(styles.component, className, size && styles[size])}
        >
            {scrollable ? (
                <ScrollableContainer
                    activeChild={focusedTab || selectedTab}
                    containerClassName={containerClassName}
                >
                    {renderContent()}
                </ScrollableContainer>
            ) : (
                <div className={cn(styles.container, containerClassName)}>{renderContent()}</div>
            )}
        </div>
    );
};
