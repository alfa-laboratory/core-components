import React from 'react';
import cn from 'classnames';
import { PrimaryTablist } from './Component';
import { TablistProps, Gaps } from '../../typings';

import styles from './desktop.module.css';

export const PrimaryTablistDesktop = ({
    gaps = 'default',
    className,
    ...restProps
}: TablistProps & Gaps) => (
    <PrimaryTablist {...restProps} styles={styles} className={cn(className, styles[gaps])} />
);
