import React, { forwardRef, HTMLAttributes, useCallback } from 'react';
import cn from 'classnames';
import { OptionsListProps, GroupShape } from '../../typings';
import { Optgroup as DefaultOptgroup } from '../optgroup';

import styles from './index.module.css';
import { isGroup } from '../../utils';

const createCounter = () => {
    let count = 0;
    // eslint-disable-next-line no-plusplus
    return () => count++;
};

export const OptionsList = forwardRef<
    HTMLDivElement,
    OptionsListProps & HTMLAttributes<HTMLDivElement>
>(
    (
        {
            className,
            size = 's',
            Option,
            options = [],
            Optgroup = DefaultOptgroup,
            flatOptions,
            open,
            highlightedIndex,
            ...restProps
        },
        ref,
    ) => {
        const counter = createCounter();

        const renderGroup = useCallback(
            (group: GroupShape) => (
                <Optgroup label={group.label} key={group.label} size={size}>
                    {group.options.map(option => (
                        <Option option={option} key={option.value} index={counter()} />
                    ))}
                </Optgroup>
            ),
            [counter, size],
        );

        return options.length > 0 ? (
            <div
                {...restProps}
                className={cn(styles.optionsList, className, styles[size])}
                ref={ref}
            >
                {options.map(option =>
                    isGroup(option) ? (
                        renderGroup(option)
                    ) : (
                        <Option option={option} key={option.value} index={counter()} />
                    ),
                )}
            </div>
        ) : null;
    },
);
