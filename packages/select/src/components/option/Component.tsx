import React from 'react';
import cn from 'classnames';
import { OptionProps } from '../../Component';

import styles from './index.module.css';

export const Option = ({
    size = 's',
    option,
    selected,
    highlighted,
    disabled,
    optionRenderer,
    ...rest
}: OptionProps) => (
    <div
        {...rest}
        className={cn(styles.option, styles[size], {
            [styles.highlighted]: highlighted,
            [styles.selected]: selected,
            [styles.disabled]: disabled,
        })}
    >
        {optionRenderer ? optionRenderer(option) : option.text}
    </div>
);
