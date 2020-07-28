import React from 'react';
import cn from 'classnames';
import { SecondaryTabList } from './Component';
import { TabListProps, Gaps } from '../../typings';
import { useWindowWidth } from '../../utils';

import styles from './responsive.module.css';

export const SecondaryTabListResponsive = ({
    gaps = 'default',
    className,
    ...restProps
}: TabListProps & Gaps) => {
    const width = useWindowWidth();

    return (
        <SecondaryTabList
            {...restProps}
            styles={styles}
            className={cn(className, styles[gaps])}
            tagSize={width >= 768 ? 's' : 'xs'}
        />
    );
};
