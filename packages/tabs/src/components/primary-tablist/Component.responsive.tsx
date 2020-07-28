import React from 'react';
import cn from 'classnames';
import { PrimaryTabList } from './Component';
import { TabListProps, Gaps } from '../../typings';
import { useWindowWidth } from '../../utils';

import styles from './responsive.module.css';

export const PrimaryTabListResponsive = ({
    gaps = 'default',
    className,
    ...restProps
}: TabListProps & Gaps) => {
    const width = useWindowWidth();

    /**
     * Вызываем ререндер при переходе из одного вида в другой.
     * Это нужно, чтобы подчеркивание имело правильную ширину (lineStyles)
     */
    const key = width >= 768 ? 'desktop' : 'mobile';

    return (
        <PrimaryTabList
            {...restProps}
            styles={styles}
            className={cn(className, styles[gaps])}
            key={key}
        />
    );
};
