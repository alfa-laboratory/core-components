import React, { useMemo } from 'react';
import cn from 'classnames';

import styles from './index.module.css';
import { THeadCell, THeadCellProps } from '../thead-cell';

import { SortIconAsc } from './sort-icon-asc';
import { SortIconDesc } from './sort-icon-desc';
import { SortIconUnset } from './sort-icon-unset';

export type TSortableHeadCellProps = THeadCellProps & {
    sorted?: boolean;
    isSortedDesc?: boolean;
    defaultIsSortedDesc?: boolean;
    onSort?: () => void;
};

export const TSortableHeadCell = ({
    children,
    className,
    sorted,
    defaultIsSortedDesc,
    isSortedDesc = defaultIsSortedDesc,
    textAlign,
    onSort,
    ...restProps
}: TSortableHeadCellProps) => {
    const SortIcon = useMemo(() => {
        if (typeof isSortedDesc === 'boolean') return isSortedDesc ? SortIconDesc : SortIconAsc;

        return SortIconUnset;
    }, [isSortedDesc]);

    return (
        <THeadCell className={cn(className, styles.component)} {...restProps}>
            <div className={cn(styles.content, { [styles.reverse]: textAlign === 'right' })}>
                {children}
                <SortIcon
                    onClick={onSort}
                    className={cn(styles.icon, {
                        [styles.sorted]: sorted,
                    })}
                />
            </div>
        </THeadCell>
    );
};
