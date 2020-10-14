import React from 'react';
import { PrimaryTabList } from './Component';
import { TabListProps } from '../../typings';

import styles from './index.module.css';

export const PrimaryTabListDesktop = ({ size = 'm', ...restProps }: TabListProps) => (
    <PrimaryTabList {...restProps} size={size} styles={styles} />
);
