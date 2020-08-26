import React from 'react';
import { SecondaryTabList } from './Component';
import { TabListProps } from '../../typings';

import mobileStyles from './mobile.module.css';
import commonStyles from './index.module.css';

const styles = {
    ...commonStyles,
    ...mobileStyles,
};

export const SecondaryTabListMobile = (props: TabListProps) => (
    <SecondaryTabList {...props} styles={styles} tagSize='xs' />
);
