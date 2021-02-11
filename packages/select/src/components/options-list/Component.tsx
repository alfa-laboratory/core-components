import React, { useCallback, useRef } from 'react';
import cn from 'classnames';
import { OptionsListProps, GroupShape } from '../../typings';
import { Optgroup as DefaultOptgroup } from '../optgroup';

import styles from './index.module.css';
import { isGroup, useVisibleOptions } from '../../utils';

const createCounter = () => {
    let count = 0;
    // eslint-disable-next-line no-plusplus
    return () => count++;
};

export const OptionsList = ({
    size = 's',
    className,
    Option,
    options = [],
    Optgroup = DefaultOptgroup,
    dataTestId,
    emptyPlaceholder,
    visibleOptions = 5,
    open,
}: OptionsListProps) => {
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
    });

    if (options.length === 0 && !emptyPlaceholder) {
        return null;
    }

    return (
        <div
            className={cn(styles.optionsList, styles[size], className)}
            data-test-id={dataTestId}
            ref={listRef}
        >
            {options.map(option =>
                isGroup(option) ? renderGroup(option) : Option({ option, index: counter() }),
            )}

            {emptyPlaceholder && options.length === 0 && (
                <div className={styles.emptyPlaceholder}>{emptyPlaceholder}</div>
            )}
        </div>
    );
};
