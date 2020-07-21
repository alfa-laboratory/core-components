import React from 'react';
import cn from 'classnames';
import { PrimaryTablist } from './Component';
import { TablistProps, Gaps } from '../../typings';
import { useWindowWidth } from '../../utils';

import styles from './responsive.module.css';

export const PrimaryTablistResponsive = ({
    gaps = 'default',
    className,
    ...restProps
}: TablistProps & Gaps) => {
    const width = useWindowWidth();

    /**
     * Вызываем ререндер при переходе из одного вида в другой.
     * Это нужно, чтобы подчеркивание имело правильную ширину (lineStyles)
     */
    const key = width >= 768 ? 'desktop' : 'mobile';

    return (
        <PrimaryTablist
            {...restProps}
            styles={styles}
            className={cn(className, styles[gaps])}
            key={key}
        />
    );
};
