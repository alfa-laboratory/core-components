import React, { ReactNode } from 'react';
import cn from 'classnames';

import styles from './Status.css';

type StatusProps = {
    children?: ReactNode;
};

export const Status: React.FC<StatusProps> = ({ children }) => (
    <div className={cn(styles.status)}>
        <a className={cn(styles.link)} href="/?path=/docs/принципы-статусы--page">
            {children}
        </a>
    </div>
);
