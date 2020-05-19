import React from 'react';
import cn from 'classnames';
import { ItemShape, OptionProps } from '../../Component';

import styles from './index.module.css';

export const Option = <T extends ItemShape>({
    item,
    selected,
    highlighted,
    itemRenderer,
}: OptionProps<T>) => {
    return (
        <div
            className={cn(styles.option, {
                [styles.highlighted]: highlighted,
                [styles.selected]: selected,
            })}
        >
            {itemRenderer ? itemRenderer(item) : item.text}
        </div>
    );
};
