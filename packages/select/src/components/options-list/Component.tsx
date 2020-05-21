import React, { useCallback } from 'react';
import { OptionsListProps, GroupShape } from '../../Component';
import { Optgroup as DefaultOptgroup } from '../optgroup';

import styles from './index.module.css';
import { isGroup } from '../../utils';

const createCounter = () => {
    let count = 0;
    // eslint-disable-next-line no-plusplus
    return () => count++;
};

export const OptionsList = ({
    children,
    open,
    options,
    Optgroup = DefaultOptgroup,
}: OptionsListProps) => {
    const counter = createCounter();

    const renderGroup = useCallback(
        (group: GroupShape) => (
            <Optgroup label={group.label} key={group.label}>
                {group.options.map(option => {
                    return children({ option, index: counter() });
                })}
            </Optgroup>
        ),
        [children, counter],
    );

    if (!open) return null;

    return (
        <div className={styles.optionsList}>
            {options.map(option =>
                isGroup(option) ? renderGroup(option) : children({ option, index: counter() }),
            )}
        </div>
    );
};
