import React from 'react';
import cn from 'classnames';
import { ItemShape, MenuItemProps } from '../../Component';

import styles from './index.module.css';

export const MenuItem = <T extends ItemShape>({
    item,
    selected,
    highlighted,
    disabled,
    itemRenderer,
}: MenuItemProps<T>) => {
    return (
        <div
            className={cn(styles.item, {
                [styles.highlighted]: highlighted,
                [styles.selected]: selected,
                [styles.disabled]: disabled,
            })}
        >
            {itemRenderer ? itemRenderer(item) : item.text || item.value}
        </div>
    );
};
