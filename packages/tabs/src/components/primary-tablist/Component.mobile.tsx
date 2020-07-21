import React from 'react';
import { PrimaryTablist } from './Component';
import { TablistProps } from '../../typings';

import styles from './mobile.module.css';

export const PrimaryTablistMobile = (props: TablistProps) => (
    <PrimaryTablist {...props} styles={styles} />
);
