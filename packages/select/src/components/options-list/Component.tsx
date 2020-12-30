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
    emptyPlaceholder,
}: OptionsListProps) => {
    const counter = createCounter();

    const renderGroup = useCallback(
        (group: GroupShape) => (
            <Optgroup label={group.label} key={group.label} size={size}>
                {group.options.map(option => Option({ option, index: counter() }))}
            </Optgroup>
        ),
        [Option, counter, size],
    );

    if (options.length === 0 && !emptyPlaceholder) {
        return null;
    }

    return (
        <div className={cn(styles.optionsList, styles[size])}>
            {options.map(option =>
                isGroup(option) ? renderGroup(option) : Option({ option, index: counter() }),
            )}

            {emptyPlaceholder && options.length === 0 && (
                <div className={styles.emptyPlaceholder}>{emptyPlaceholder}</div>
            )}
        </div>
    );
};
