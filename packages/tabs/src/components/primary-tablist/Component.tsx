import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { useTabs } from '../../useTabs';
import { ScrollableContainer } from '../scrollable-container';
import { TablistProps } from '../../typings';

import styles from './index.module.css';

type PrimaryTablistProps = TablistProps & {
    /**
     * Управление размером отступов между заголовками
     */
    gaps?: 'default' | 'wide';
};

export const PrimaryTablist = ({
    className,
    gaps = 'default',
    titles = [],
    selectedId = titles[0].id,
    scrollable = true,
    onChange,
}: PrimaryTablistProps) => {
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
                    className={cn(styles.title, styles[gaps], {
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
