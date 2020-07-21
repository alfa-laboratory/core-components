import React from 'react';
import { PrimaryTabList } from './Component';
import { TabListProps } from '../../typings';

import styles from './mobile.module.css';

export const PrimaryTabListMobile = (props: TabListProps) => (
    <PrimaryTabList {...props} styles={styles} />
);
