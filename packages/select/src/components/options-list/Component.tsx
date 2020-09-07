import React, { useCallback } from 'react';
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

export const OptionsList = ({
    size = 's',
    Option,
    options = [],
    Optgroup = DefaultOptgroup,
}: OptionsListProps) => {
    const counter = createCounter();

    const renderGroup = useCallback(
        (group: GroupShape) => (
            <Optgroup label={group.label} key={group.label}>
                {group.options.map(option => (
                    <Option option={option} key={option.value} index={counter()} />
                ))}
            </Optgroup>
        ),
        [counter],
    );

    return options.length > 0 ? (
        <div className={cn(styles.optionsList, styles[size])}>
            {options.map(option =>
                isGroup(option) ? (
                    renderGroup(option)
                ) : (
                    <Option option={option} key={option.value} index={counter()} />
                ),
            )}
        </div>
    ) : null;
};
