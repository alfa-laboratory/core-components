import React from 'react';
import cn from 'classnames';
import { PrimaryTabList } from './Component';
import { TabListProps, Gaps } from '../../typings';

import styles from './desktop.module.css';

export const PrimaryTabListDesktop = ({
    gaps = 'default',
    className,
    ...restProps
}: TabListProps & Gaps) => (
    <PrimaryTabList {...restProps} styles={styles} className={cn(className, styles[gaps])} />
);
