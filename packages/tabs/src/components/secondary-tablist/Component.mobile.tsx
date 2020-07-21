import React from 'react';
import { SecondaryTablist } from './Component';
import { TablistProps } from '../../typings';

import styles from './mobile.module.css';

export const SecondaryTablistMobile = (props: TablistProps) => (
    <SecondaryTablist {...props} styles={styles} tagSize='xs' />
);
