import React, { useMemo } from 'react';
import cn from 'classnames';

import styles from './index.module.css';
import { THeadCell, THeadCellProps } from '../thead-cell';

import { SortIconAsc } from './sort-icon-asc';
import { SortIconDesc } from './sort-icon-desc';
import { SortIconUnset } from './sort-icon-unset';

export type TSortableHeadCellProps = THeadCellProps & {
    isSortedDesc?: boolean;
    defaultIsSortedDesc?: boolean;
    onSort?: () => void;
};

export const TSortableHeadCell = ({
    children,
    className,
    defaultIsSortedDesc,
    isSortedDesc,
    textAlign,
    onSort,
    ...restProps
}: TSortableHeadCellProps) => {
    const SortIcon = useMemo(() => {
        let value = isSortedDesc;

        if (value === undefined) value = defaultIsSortedDesc;

        if (typeof value === 'boolean') return value ? SortIconDesc : SortIconAsc;

        return SortIconUnset;
    }, [defaultIsSortedDesc, isSortedDesc]);

    return (
        <THeadCell className={cn(className, styles.component)} {...restProps}>
            <div className={cn(styles.content, { [styles.reverse]: textAlign === 'right' })}>
                {children}
                <SortIcon
                    onClick={onSort}
                    className={cn(styles.icon, {
                        [styles.sorted]: isSortedDesc !== undefined,
                    })}
                />
            </div>
        </THeadCell>
    );
};
