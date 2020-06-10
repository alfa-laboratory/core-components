import React, { useRef, useState, useEffect, useCallback } from 'react';
import cn from 'classnames';

import styles from './index.module.css';
import { ScrollableContainer } from '../scrollable-container';

export type TabsHeaderProps = {
    className?: string;

    titles: Array<{
        title: string;
        id: string | number;
    }>;

    selected?: string | number;

    scrollable?: boolean;

    onChange?: (event: MouseEvent, payload: { selected?: string | number }) => void;
};

export const PrimaryTabsHeader = ({
    className,
    titles = [],
    selected = titles[0].id,
    scrollable = true,
    onChange,
}: TabsHeaderProps) => {
    const selectedTabRef = useRef<HTMLButtonElement>(null);
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
        const selectedTab = selectedTabRef.current as HTMLButtonElement;

        setLineStyles({
            width: selectedTab.offsetWidth,
            transform: `translateX(${selectedTab.offsetLeft}px)`,
        });
    }, [selected]);

    const renderContent = () => (
        <React.Fragment>
            {titles.map(item => (
                <button
                    key={item.id}
                    type='button'
                    className={cn(styles.title, {
                        [styles.selected]: item.id === selected,
                    })}
                    ref={item.id === selected ? selectedTabRef : null}
                    onClick={event => handleItemClick(event, item)}
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
            className={cn(styles.component, className, {
                [styles.scrollable]: scrollable,
            })}
        >
            {scrollable ? (
                <ScrollableContainer activeChild={selectedTabRef.current as Element}>
                    {renderContent()}
                </ScrollableContainer>
            ) : (
                <div className={styles.container}>{renderContent()}</div>
            )}
        </div>
    );
};
