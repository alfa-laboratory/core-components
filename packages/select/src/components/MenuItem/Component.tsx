import React from 'react';
import cn from 'classnames';
import { MenuItemProps } from '../../Component';

import styles from './index.module.css';

export const MenuItem = ({
    item,
    selected,
    highlighted,
    disabled,
    itemRenderer,
}: MenuItemProps) => {
    return (
        <div
            className={cn(styles.item, {
                [styles.highlighted]: highlighted,
                [styles.selected]: selected,
                [styles.disabled]: disabled,
            })}
        >
            {itemRenderer ? itemRenderer(item) : item.text}
        </div>
    );
};
