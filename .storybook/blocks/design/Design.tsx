import React, { ReactNode } from 'react';
import cn from 'classnames';

import styles from './Design.css';

type DesignProps = {
    children?: ReactNode;
};

export const Design: React.FC<DesignProps> = ({ children }) => (
    <div className={cn(styles.design)}>{children}</div>
);
