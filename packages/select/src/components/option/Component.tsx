import React from 'react';
import cn from 'classnames';
import { OptionProps } from '../../Component';

import styles from './index.module.css';

export const Option = ({
    option,
    selected,
    highlighted,
    disabled,
    optionRenderer,
}: OptionProps) => (
    <div
        className={cn(styles.option, {
            [styles.highlighted]: highlighted,
            [styles.selected]: selected,
            [styles.disabled]: disabled,
        })}
    >
        {optionRenderer ? optionRenderer(option) : option.text}
    </div>
);
