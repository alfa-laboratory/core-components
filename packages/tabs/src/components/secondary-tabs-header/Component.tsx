import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { Tag } from '@alfalab/core-components-tag';
import { ScrollableContainer } from '../scrollable-container';
import { TabsHeaderProps } from '../../typings';

import styles from './index.module.css';

export const SecondaryTabsHeader = ({
    className,
    titles = [],
    selectedId = titles[0].id,
    scrollable = true,
    onChange,
}: TabsHeaderProps) => {
    const [selectedTab, setSelectedTab] = useState<HTMLElement | null>(null);

    const handleItemClick = useCallback(
        (event, item) => {
            if (onChange) {
                onChange(event, { selectedId: item.id });
            }
        },
        [onChange],
    );

    const renderContent = () => (
        <React.Fragment>
            {titles.map(item => {
                const itemSelected = item.id === selectedId;

                return (
                    <Tag
                        ref={itemSelected ? setSelectedTab : null}
                        key={item.id}
                        className={styles.title}
                        checked={itemSelected}
                        onClick={event => handleItemClick(event, item)}
                    >
                        {item.title}
                    </Tag>
                );
            })}
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
