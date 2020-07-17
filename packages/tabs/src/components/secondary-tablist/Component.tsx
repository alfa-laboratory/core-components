import React from 'react';
import cn from 'classnames';
import { Tag } from '@alfalab/core-components-tag';
import { ScrollableContainer } from '../scrollable-container';
import { SecondaryTablistProps, Styles } from '../../typings';
import { useTabs } from '../../useTabs';

export const SecondaryTablist = ({
    styles = {},
    className,
    titles = [],
    selectedId = titles.length ? titles[0].id : undefined,
    scrollable = true,
    tagSize,
    onChange,
    dataTestId,
}: SecondaryTablistProps & Styles) => {
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
                size={tagSize}
            >
                {item.title}
            </Tag>
        ));

    return (
        <div
            role='tablist'
            data-test-id={dataTestId}
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
