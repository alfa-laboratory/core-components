import React, { forwardRef, useCallback, useRef } from 'react';
import cn from 'classnames';
import mergeRefs from 'react-merge-refs';
import { OptionsListProps, GroupShape, OptionShape } from '../../typings';
import { Optgroup as DefaultOptgroup } from '../optgroup';
import { isGroup, useVisibleOptions } from '../../utils';

import styles from './index.module.css';

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
            getOptionProps,
            options = [],
            Optgroup = DefaultOptgroup,
            dataTestId,
            emptyPlaceholder,
            visibleOptions = 5,
            onScroll,
            open,
            header,
            footer,
        }: OptionsListProps,
        ref,
    ) => {
        const renderOption = useCallback(
            (option: OptionShape, index: number) => (
                <Option key={option.key} {...getOptionProps(option, index)} />
            ),
            [getOptionProps],
        );

        const listRef = useRef<HTMLDivElement>(null);
        const counter = createCounter();
        const renderGroup = useCallback(
            (group: GroupShape) => (
                <Optgroup label={group.label} key={group.label} size={size}>
                    {group.options.map(option => renderOption(option, counter()))}
                </Optgroup>
            ),
            [counter, renderOption, size],
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
            <div
                className={cn(styles.optionsList, styles[size], className)}
                data-test-id={dataTestId}
            >
                {header}

                <div
                    className={styles.scrollable}
                    ref={mergeRefs([listRef, ref])}
                    onScroll={onScroll}
                >
                    {options.map(option =>
                        isGroup(option) ? renderGroup(option) : renderOption(option, counter()),
                    )}

                    {emptyPlaceholder && options.length === 0 && (
                        <div className={styles.emptyPlaceholder}>{emptyPlaceholder}</div>
                    )}
                </div>

                {footer}
            </div>
        );
    },
);
