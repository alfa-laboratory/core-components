import React from 'react';
import cn from 'classnames';
import { PrimaryTabList } from './Component';
import { TabListProps, Gaps } from '../../typings';

import desktopStyles from './desktop.module.css';
import commonStyles from './index.module.css';

const styles = {
    ...commonStyles,
    ...desktopStyles,
};

export const PrimaryTabListDesktop = ({
    gaps = 'default',
    className,
    ...restProps
}: TabListProps & Gaps) => (
    <PrimaryTabList {...restProps} styles={styles} className={cn(className, styles[gaps])} />
);
