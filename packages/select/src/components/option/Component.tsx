import React from 'react';
import cn from 'classnames';
import { BaseOptionProps } from '../../typings';

import styles from './index.module.css';

export type OptionProps = BaseOptionProps;

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
