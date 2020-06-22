import React from 'react';
import { SecondaryTablist } from './Component';
import { TablistProps } from '../../typings';

import commonStyles from './index.module.css';
import mobileStyles from './mobile.module.css';

const styles = {
    ...commonStyles,
    ...mobileStyles,
};

export const SecondaryTablistMobile = (props: TablistProps) => (
    <SecondaryTablist {...props} styles={styles} tagSize='xs' />
);
