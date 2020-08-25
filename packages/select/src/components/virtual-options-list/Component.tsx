/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { useVirtual } from 'react-virtual';
import { BaseOptionsListProps, GroupShape, OptionShape } from '../../typings';
import { Optgroup as DefaultOptgroup } from '../optgroup';
import { isGroup, lastIndexOf, usePrevious } from '../../utils';

import styles from './index.module.css';

export type VirtualOptionsList = BaseOptionsListProps & {
    /**
     * Число отрисованных пунктов до\после видимого окна
     */
    overscan?: number;
};

export const VirtualOptionsList = ({
    size = 's',
    flatOptions = [],
    highlightedIndex = -1,
    children,
    open,
    options = [],
    overscan = 10,
    Optgroup = DefaultOptgroup,
}: VirtualOptionsList) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const prevHighlightedIndex = usePrevious(highlightedIndex) || -1;

    const rowVirtualizer = useVirtual({
        size: flatOptions.length,
        parentRef,
        overscan,
    });

    // Сколл к выбранному пункту при открытии меню
    useEffect(() => {
        if (open) {
            rowVirtualizer.scrollToIndex(highlightedIndex, { align: 'end' });
        }
    }, [open]);

    // Скролл к пункту, которого нет на экране
    useEffect(() => {
        if (!rowVirtualizer.virtualItems.some(option => option.index === highlightedIndex)) {
            rowVirtualizer.scrollToIndex(highlightedIndex, { align: 'end' });
        }
    }, [highlightedIndex]);

    // Циклическая навигация
    useEffect(() => {
        const notDisabled = (option: OptionShape) => !option.disabled;
        const firstNonDisabled = flatOptions.findIndex(notDisabled);
        const lastNonDisabled = lastIndexOf(flatOptions, notDisabled);

        if (
            prevHighlightedIndex <= firstNonDisabled &&
            highlightedIndex === flatOptions.length - 1
        ) {
            rowVirtualizer.scrollToIndex(lastNonDisabled);
        }

        if (prevHighlightedIndex >= lastNonDisabled && highlightedIndex === 0) {
            rowVirtualizer.scrollToIndex(0);
        }
    }, [prevHighlightedIndex, highlightedIndex]);

    // Т.к. рендерится плоский список, необходимо знать индекс, когда начинается новая группа
    const groupStartIndexes = useMemo(() => {
        let currentIndex = 0;
        return options.reduce((acc: { [key: number]: number }, option, index) => {
            if (isGroup(option)) {
                acc[currentIndex] = index;
                currentIndex += option.options.length;
            } else {
                currentIndex += 1;
            }
            return acc;
        }, {});
    }, [options]);

    return (
        <div className={cn(styles.virtualOptionsList, styles[size])} ref={parentRef}>
            {rowVirtualizer.virtualItems.map(virtualRow => {
                const option = flatOptions[virtualRow.index];
                const group = options[groupStartIndexes[virtualRow.index]] as GroupShape;

                return (
                    <div
                        key={virtualRow.index}
                        ref={virtualRow.measureRef}
                        className={styles.virtualRow}
                        style={{
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        {group && <Optgroup label={group.label} />}
                        {!isGroup(option) && children({ option, index: virtualRow.index })}
                    </div>
                );
            })}
        </div>
    );
};
