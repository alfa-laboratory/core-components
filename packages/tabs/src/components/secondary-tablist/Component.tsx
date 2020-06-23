import React from 'react';
import cn from 'classnames';
import { Tag } from '@alfalab/core-components-tag';
import { ScrollableContainer } from '../scrollable-container';
import { TablistProps } from '../../typings';
import { useTabs } from '../../useTabs';

import styles from './index.module.css';

export const SecondaryTablist = ({
    className,
    titles = [],
    selectedId = titles.length ? titles[0].id : undefined,
    scrollable = true,
    onChange,
}: TablistProps) => {
    const { focusedTab, selectedTab, getTablistItemProps } = useTabs({
        titles,
        selectedId,
        onChange,
    });

    const renderContent = () =>
        titles.map((item, index) => (
            <Tag
                {...getTablistItemProps(index)}
                key={item.id}
                className={styles.title}
                checked={item.id === selectedId}
            >
                {item.title}
            </Tag>
        ));

    return (
        <div
            role='tablist'
            className={cn(styles.component, className, {
                [styles.scrollable]: scrollable,
            })}
        >
            {scrollable ? (
                <ScrollableContainer activeChild={focusedTab || selectedTab}>
                    {renderContent()}
                </ScrollableContainer>
            ) : (
                <div className={styles.container}>{renderContent()}</div>
            )}
        </div>
    );
};
