import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { useTabs } from '../../useTabs';
import { ScrollableContainer } from '../scrollable-container';
import { TabListProps, Styles } from '../../typings';

export const PrimaryTabList = ({
    styles = {},
    className,
    titles = [],
    selectedId = titles.length ? titles[0].id : undefined,
    scrollable = true,
    onChange,
    dataTestId,
}: TabListProps & Styles) => {
    const lineRef = useRef<HTMLDivElement>(null);

    const { selectedTab, focusedTab, getTabListItemProps } = useTabs({
        titles,
        selectedId,
        onChange,
    });

    useEffect(() => {
        if (selectedTab && lineRef.current) {
            lineRef.current.style.width = `${selectedTab.offsetWidth}px`;
            lineRef.current.style.transform = `translateX(${selectedTab.offsetLeft}px)`;
        }
    });

    const renderContent = () => (
        <React.Fragment>
            {titles.map((item, index) => (
                <button
                    {...getTabListItemProps(index)}
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

            <div className={styles.line} ref={lineRef} />
        </React.Fragment>
    );

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
