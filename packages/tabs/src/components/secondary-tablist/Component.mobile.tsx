import React from 'react';
import { SecondaryTabList } from './Component';
import { TabListProps } from '../../typings';

import styles from './mobile.module.css';

export const SecondaryTabListMobile = (props: TabListProps) => (
    <SecondaryTabList {...props} styles={styles} tagSize='xs' />
);
