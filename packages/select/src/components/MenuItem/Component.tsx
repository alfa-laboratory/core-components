import React from 'react';
import cn from 'classnames';
import { ItemShape, MenuItemProps } from '../../Component';

import styles from './index.module.css';

export const MenuItem = <T extends ItemShape>({
    item,
    itemToString,
    selected,
    highlighted,
}: MenuItemProps<T>) => {
    return (
        <span
            className={cn(styles.item, {
                [styles.highlighted]: highlighted,
                [styles.selected]: selected,
            })}
        >
            {itemToString && itemToString(item)}
        </span>
    );
};
