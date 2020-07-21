import { useState, useCallback, useRef, MouseEvent, KeyboardEvent } from 'react';
import { UseTabsProps } from './typings';

export function useTabs({ titles, selectedId, onChange }: UseTabsProps) {
    const [selectedTab, setSelectedTab] = useState<HTMLButtonElement | null>(null);
    const [focusedTab, setFocusedTab] = useState<HTMLButtonElement | null>(null);
    const itemRefs = useRef<HTMLButtonElement[]>([]);

    const handleItemRef = useCallback(
        (node, item, index) => {
            if (node && item.id === selectedId) setSelectedTab(node);
            itemRefs.current[index] = node;
        },
        [selectedId],
    );

    const handleItemClick = useCallback(
        (event, item) => {
            if (onChange) {
                onChange(event, { selectedId: item.id });
            }
        },
        [onChange],
    );

    const focusTab = useCallback(
        (position: 'prev' | 'next' | 'start' | 'end') => {
            const refs = itemRefs.current;

            let focusedTabIndex = refs.findIndex(node => document.activeElement === node);

            if (focusedTabIndex === -1) {
                focusedTabIndex = refs.findIndex(node => node === selectedTab);
            }

            let newFocusIndex;
            switch (position) {
                case 'prev':
                    newFocusIndex = focusedTabIndex === 0 ? refs.length - 1 : focusedTabIndex - 1;
                    break;
                case 'next':
                    newFocusIndex = focusedTabIndex === refs.length - 1 ? 0 : focusedTabIndex + 1;
                    break;
                case 'start':
                    newFocusIndex = 0;
                    break;
                case 'end':
                    newFocusIndex = refs.length - 1;
                    break;
            }

            refs[newFocusIndex].focus();

            setFocusedTab(refs[newFocusIndex]);
        },
        [selectedTab, itemRefs],
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>) => {
            switch (event.key) {
                case 'ArrowLeft':
                    focusTab('prev');

                    event.preventDefault();
                    break;
                case 'ArrowRight':
                    focusTab('next');

                    event.preventDefault();
                    break;
                case 'Home':
                    focusTab('start');

                    event.preventDefault();
                    break;
                case 'End':
                    focusTab('end');

                    event.preventDefault();
                    break;
                default:
                    break;
            }
        },
        [focusTab],
    );

    const getTabListItemProps = (index: number) => {
        const item = titles[index];
        const itemSelected = item.id === selectedId;
        return {
            role: 'tab',
            tabIndex: itemSelected ? 0 : -1,
            ref: (node: HTMLButtonElement) => handleItemRef(node, item, index),
            onKeyDown: handleKeyDown,
            onClick: (event?: MouseEvent) => handleItemClick(event, item),
        };
    };

    return {
        getTabListItemProps,
        selectedTab,
        focusedTab,
    };
}
