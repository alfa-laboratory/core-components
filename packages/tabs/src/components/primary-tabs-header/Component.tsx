import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { ScrollableContainer } from '../scrollable-container';
import { TabsHeaderProps } from '../../typings';

import styles from './index.module.css';

type PrimaryTabsHeaderProps = TabsHeaderProps & {
    gaps?: 'default' | 'wide';
};

export const PrimaryTabsHeader = ({
    className,
    gaps = 'default',
    titles = [],
    selected = titles[0].id,
    scrollable = true,
    onChange,
}: PrimaryTabsHeaderProps) => {
    const [selectedTab, setSelectedTab] = useState<HTMLElement | null>(null);
    const [lineStyles, setLineStyles] = useState<{ width?: number; transform?: string }>();

    const handleItemClick = useCallback(
        (event, item) => {
            if (onChange) {
                onChange(event, { selected: item.id });
            }
        },
        [onChange],
    );

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
            {titles.map(item => {
                const itemSelected = item.id === selected;

                return (
                    <button
                        key={item.id}
                        type='button'
                        className={cn(styles.title, styles[gaps], {
                            [styles.selected]: itemSelected,
                        })}
                        ref={itemSelected ? setSelectedTab : null}
                        onClick={event => handleItemClick(event, item)}
                    >
                        <span tabIndex={-1} className={styles.titleWrapper}>
                            {item.title}
                        </span>
                    </button>
                );
            })}
            <div className={styles.line} style={lineStyles} />
        </React.Fragment>
    );

    return (
        <div
            className={cn(styles.component, className, {
                [styles.scrollable]: scrollable,
            })}
        >
            {scrollable ? (
                <ScrollableContainer activeChild={selectedTab}>
                    {renderContent()}
                </ScrollableContainer>
            ) : (
                <div className={styles.container}>{renderContent()}</div>
            )}
        </div>
    );
};
