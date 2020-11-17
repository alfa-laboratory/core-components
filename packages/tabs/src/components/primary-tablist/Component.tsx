import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { KeyboardFocusable } from '@alfalab/core-components-keyboard-focusable';
import { useTabs } from '../../useTabs';
import { ScrollableContainer } from '../scrollable-container';
import { TabListProps, Styles } from '../../typings';

export const PrimaryTabList = ({
    size,
    styles = {},
    className,
    containerClassName,
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
                <KeyboardFocusable key={item.id}>
                    {(ref, focused) => (
                        <button
                            {...getTabListItemProps(index, ref)}
                            type='button'
                            className={cn(styles.title, {
                                [styles.selected]: item.id === selectedId,
                            })}
                        >
                            <span className={cn(focused && styles.focused)}>{item.title}</span>
                            {item.rightAddons && (
                                <span className={styles.rightAddons}>{item.rightAddons}</span>
                            )}
                        </button>
                    )}
                </KeyboardFocusable>
            ))}

            <div className={styles.line} ref={lineRef} />
        </React.Fragment>
    );

    return (
        <div
            role='tablist'
            data-test-id={dataTestId}
            className={cn(styles.component, className, size && styles[size], {
                [styles.scrollable]: scrollable,
            })}
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
