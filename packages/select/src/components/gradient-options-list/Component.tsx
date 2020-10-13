import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { OptionsListProps } from '../../typings';

import styles from './index.module.css';
import { OptionsList } from '../options-list';

export const GradientOptionsList = forwardRef<HTMLDivElement, OptionsListProps>(
    ({ className, highlightedIndex, open, ...restProps }, ref) => {
        const listRef = useRef<HTMLDivElement>(null);

        const [topReached, setTopReached] = useState(true);
        const [bottomReached, setBottomReached] = useState(false);

        const detectReach = useCallback((element: HTMLDivElement) => {
            const { scrollTop, offsetHeight, scrollHeight } = element;
            setTopReached(Math.round(scrollTop) === 0);
            setBottomReached(Math.round(scrollTop) + offsetHeight === scrollHeight);
        }, []);

        const handleScroll = useCallback(
            event => {
                detectReach(event.target);
            },
            [detectReach],
        );

        useEffect(() => {
            if (open && listRef.current) {
                detectReach(listRef.current);
            }
        }, [detectReach, open]);

        return (
            <div
                className={cn(className, styles.component, {
                    [styles.bottomReached]: bottomReached,
                    [styles.topReached]: topReached,
                })}
            >
                <OptionsList
                    {...restProps}
                    ref={mergeRefs([ref, listRef])}
                    onScroll={handleScroll}
                    open={open}
                    highlightedIndex={highlightedIndex}
                />
            </div>
        );
    },
);
