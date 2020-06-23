import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { useTabs } from '../../useTabs';
import { ScrollableContainer } from '../scrollable-container';
import { TablistProps, Styles } from '../../typings';

export const PrimaryTablist = ({
    styles = {},
    className,
    titles = [],
    selectedId = titles.length ? titles[0].id : undefined,
    scrollable = true,
    onChange,
}: TablistProps & Styles) => {
    const { selectedTab, focusedTab, getTablistItemProps } = useTabs({
        titles,
        selectedId,
        onChange,
    });
    const [lineStyles, setLineStyles] = useState<{ width?: number; transform?: string }>();

    useEffect(() => {
        if (selectedTab) {
            setLineStyles({
                width: selectedTab.offsetWidth,
                transform: `translateX(${selectedTab.offsetLeft}px)`,
            });
        }
    }, [selectedTab]);

    const renderContent = () => (
        <React.Fragment>
            {titles.map((item, index) => (
                <button
                    {...getTablistItemProps(index)}
                    type='button'
                    key={item.id}
                    className={cn(styles.title, {
                        [styles.selected]: item.id === selectedId,
                    })}
                >
                    <span tabIndex={-1} className={styles.titleWrapper}>
                        {item.title}
                    </span>
                </button>
            ))}

            <div className={styles.line} style={lineStyles} />
        </React.Fragment>
    );

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
