import React from 'react';
import cn from 'classnames';
import { PrimaryTablist } from './Component';
import { TablistProps, Gaps } from '../../typings';

import commonStyles from './index.module.css';
import desktopStyles from './desktop.module.css';

const styles = {
    ...commonStyles,
    ...desktopStyles,
};

export const PrimaryTablistDesktop = ({
    gaps = 'default',
    className,
    ...restProps
}: TablistProps & Gaps) => (
    <PrimaryTablist {...restProps} styles={styles} className={cn(className, styles[gaps])} />
);
