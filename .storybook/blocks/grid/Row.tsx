import React, { InputHTMLAttributes, useCallback, ChangeEvent, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Row.module.css';

type RowProps = {
    children?: ReactNode;
    className?: string;
    align?: 'top' | 'middle' | 'bottom';
    flex?: boolean;
};

export const Row: React.FC<RowProps> = ({ align, flex, className, children, ...restProps }) => (
    <div
        className={cn(styles.row, className, styles[align], {
            [styles.flex]: flex,
        })}
        {...restProps}
    >
        {children}
    </div>
);
