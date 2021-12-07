import React, { FC } from 'react';
import cn from 'classnames';

import { Tag as CoreTag, TagProps } from '@alfalab/core-components-tag';

import styles from './index.module.css';

export const Tag: FC<TagProps> = ({ className, checked, ...restProps }) => (
    <CoreTag
        {...restProps}
        checked={checked}
        size='xxs'
        className={cn(className, styles.tag, { [styles.checked]: checked })}
    />
);

export const TagWithCount: FC<TagProps & { count: number }> = ({ count, ...restProps }) => (
    <Tag
        {...restProps}
        rightAddons={count === 0 ? null : <div className={styles.tagCount}>{count}</div>}
    />
);
