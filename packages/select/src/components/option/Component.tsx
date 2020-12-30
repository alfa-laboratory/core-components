import React, { FC } from 'react';
import cn from 'classnames';
import { Checkmark as DefaultCheckMark } from '../checkmark';
import { OptionProps } from '../../typings';

import styles from './index.module.css';

export const Option: FC<OptionProps> = ({
    size = 's',
    className,
    option,
    children,
    selected,
    highlighted,
    disabled,
    Checkmark = DefaultCheckMark,
    innerProps,
    dataTestId,
}) => (
    <div
        {...innerProps}
        className={cn(styles.option, styles[size], className, {
            [styles.highlighted]: highlighted,
            [styles.selected]: selected,
            [styles.disabled]: disabled,
        })}
        data-test-id={dataTestId}
    >
        {Checkmark && <Checkmark selected={selected} />}
        <div className={styles.content}>{children || option.content || option.key}</div>
    </div>
);
