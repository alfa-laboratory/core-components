import React from 'react';
import { PrimaryTabList } from './Component';
import { TabListProps } from '../../typings';

import mobileStyles from './mobile.module.css';
import commonStyles from './index.module.css';

const styles = {
    ...commonStyles,
    ...mobileStyles,
};

export const PrimaryTabListMobile = (props: TabListProps) => (
    <PrimaryTabList {...props} styles={styles} />
);
