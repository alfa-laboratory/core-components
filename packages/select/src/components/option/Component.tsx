import React from 'react';
import cn from 'classnames';
import { OptionProps } from '../../typings';

import styles from './index.module.css';

export const Option = ({
    size = 's',
    option,
    children,
    selected,
    highlighted,
    disabled,
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
        {children || option.content || option.text || option.value}
    </div>
);
