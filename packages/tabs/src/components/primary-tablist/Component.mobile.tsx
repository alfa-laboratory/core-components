import React from 'react';
import { PrimaryTablist } from './Component';
import { TablistProps } from '../../typings';

import commonStyles from './index.module.css';
import mobileStyles from './mobile.module.css';

const styles = {
    ...commonStyles,
    ...mobileStyles,
};

export const PrimaryTablistMobile = (props: TablistProps) => (
    <PrimaryTablist {...props} styles={styles} />
);
