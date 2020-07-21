import React from 'react';
import cn from 'classnames';
import { SecondaryTablist } from './Component';
import { TablistProps, Gaps } from '../../typings';

import styles from './desktop.module.css';

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
