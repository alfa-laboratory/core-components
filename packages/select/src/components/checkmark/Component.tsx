import React from 'react';
import cn from 'classnames';
import { CheckmarkProps } from '../../typings';

import styles from './index.module.css';

export const Checkmark = ({ selected }: CheckmarkProps) => (
    <span
        className={cn(styles.checkmark, {
            [styles.selected]: selected,
        })}
    />
);
