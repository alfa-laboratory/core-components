import React from 'react';
import cn from 'classnames';
import { SecondaryTabList } from './Component';
import { TabListProps, Gaps } from '../../typings';
import { useWindowWidth } from '../../utils';

import responsiveStyles from './responsive.module.css';
import commonStyles from './index.module.css';

const styles = {
    ...commonStyles,
    ...responsiveStyles,
};

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
