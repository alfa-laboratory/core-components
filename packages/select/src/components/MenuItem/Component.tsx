import React from 'react';
import cn from 'classnames';
import { ItemShape, MenuItemProps } from '../../Component';

import styles from './index.module.css';

const defaultValueRenderer = <T extends ItemShape>(item: T, itemToString: (item: T) => string) =>
    itemToString(item);

export const MenuItem = <T extends ItemShape>({
    item,
    itemToString,
    selected,
    highlighted,
    valueRenderer = defaultValueRenderer,
}: MenuItemProps<T>) => {
    return (
        <div
            className={cn(styles.item, {
                [styles.highlighted]: highlighted,
                [styles.selected]: selected,
            })}
        >
            {valueRenderer(item, itemToString)}
        </div>
    );
};
