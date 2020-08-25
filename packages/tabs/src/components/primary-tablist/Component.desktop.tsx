import React from 'react';
import cn from 'classnames';
import { PrimaryTabList } from './Component';
import { TabListProps, Gaps } from '../../typings';

import desktopStyles from './desktop.module.css';
import commonStyles from './index.module.css';

// TODO: возможно, для объединения стилей есть способ лучше, т.к. из-за этого ломаются снэпшоты
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
