import React from 'react';
import cn from 'classnames';
import { SecondaryTablist } from './Component';
import { TablistProps, Gaps } from '../../typings';

import commonStyles from './index.module.css';
import desktopStyles from './desktop.module.css';

const styles = {
    ...commonStyles,
    ...desktopStyles,
};

export const SecondaryTablistDesktop = ({
    gaps = 'default',
    className,
    ...restProps
}: TablistProps & Gaps) => (
    <SecondaryTablist
        {...restProps}
        styles={styles}
        className={cn(className, styles[gaps])}
        tagSize='s'
    />
);
