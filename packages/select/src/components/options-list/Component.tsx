import React, { forwardRef, useCallback, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { Scrollbar } from '@alfalab/core-components-scrollbar';
import { OptionsListProps, GroupShape } from '../../typings';
import { Optgroup as DefaultOptgroup } from '../optgroup';

import styles from './index.module.css';
import { isGroup, useVisibleOptions } from '../../utils';

const createCounter = () => {
    let count = 0;
    // eslint-disable-next-line no-plusplus
    return () => count++;
};

export const OptionsList = forwardRef(
    (
        {
            size = 's',
            className,
            Option,
            options = [],
            Optgroup = DefaultOptgroup,
            dataTestId,
            emptyPlaceholder,
            visibleOptions = 5,
            onScroll,
            open,
        }: OptionsListProps,
        ref,
    ) => {
        const listRef = useRef<HTMLDivElement>(null);
        const counter = createCounter();
        const renderGroup = useCallback(
            (group: GroupShape) => (
                <Optgroup label={group.label} key={group.label} size={size}>
                    {group.options.map(option => Option({ option, index: counter() }))}
                </Optgroup>
            ),
            [Option, counter, size],
        );

        useVisibleOptions({
            visibleOptions,
            listRef,
            open,
            invalidate: options,
        });

        if (options.length === 0 && !emptyPlaceholder) {
            return null;
        }

        return (
            <Scrollbar
                className={cn(styles.optionsList, styles[size], className)}
                data-test-id={dataTestId}
                ref={mergeRefs([listRef, ref])}
                onScroll={onScroll}
            >
                {options.map(option =>
                    isGroup(option) ? renderGroup(option) : Option({ option, index: counter() }),
                )}

                {emptyPlaceholder && options.length === 0 && (
                    <div className={styles.emptyPlaceholder}>{emptyPlaceholder}</div>
                )}
            </Scrollbar>
        );
    },
);
