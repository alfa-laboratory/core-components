import React from 'react';
import cn from 'classnames';
import { SecondaryTablist } from './Component';
import { TablistProps, Gaps } from '../../typings';
import { useWindowWidth } from '../../utils';

import styles from './responsive.module.css';

export const SecondaryTablistResponsive = ({
    gaps = 'default',
    className,
    ...restProps
}: TablistProps & Gaps) => {
    const width = useWindowWidth();

    return (
        <SecondaryTablist
            {...restProps}
            styles={styles}
            className={cn(className, styles[gaps])}
            tagSize={width >= 768 ? 's' : 'xs'}
        />
    );
};
