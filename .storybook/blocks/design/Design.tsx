import React, { ReactNode } from 'react';
import cn from 'classnames';

import styles from './Design.css';

type DesignProps = {
    children?: ReactNode;
    className?: string;
};

export const Design: React.FC<DesignProps> = ({ className, children }) => (
    <div className={cn(styles.design, className)}>{children}</div>
);
