import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { KeyboardFocusable } from '@alfalab/core-components-keyboard-focusable';
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
    const { selectedTab, focusedTab, getTabListItemProps } = useTabs({
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
                <KeyboardFocusable key={item.id}>
                    {(ref, focused) => (
                        <button
                            {...getTabListItemProps(index, ref)}
                            type='button'
                            className={cn(styles.title, {
                                [styles.selected]: item.id === selectedId,
                                [styles.focused]: focused,
                            })}
                        >
                            <span tabIndex={-1} className={styles.titleWrapper}>
                                {item.title}
                            </span>
                        </button>
                    )}
                </KeyboardFocusable>
            ))}

            <div className={styles.line} style={lineStyles} />
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
