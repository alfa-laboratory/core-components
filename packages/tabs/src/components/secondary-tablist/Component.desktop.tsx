import React from 'react';
import cn from 'classnames';
import { SecondaryTabList } from './Component';
import { TabListProps, Gaps } from '../../typings';

import desktopStyles from './desktop.module.css';
import commonStyles from './index.module.css';

const styles = {
    ...commonStyles,
    ...desktopStyles,
};

export const SecondaryTabListDesktop = ({
    gaps = 'default',
    className,
    ...restProps
}: TabListProps & Gaps) => (
    <SecondaryTabList
        {...restProps}
        styles={styles}
        className={cn(className, styles[gaps])}
        tagSize='s'
    />
);
