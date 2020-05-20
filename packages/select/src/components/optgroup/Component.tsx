import React from 'react';
import { OptgroupProps } from '../../Component';

import styles from './index.module.css';

export const Optgroup = ({ children, label }: OptgroupProps) => {
    return (
        <div className={styles.optgroup}>
            <span className={styles.label}>{label}</span>
            {children}
        </div>
    );
};
