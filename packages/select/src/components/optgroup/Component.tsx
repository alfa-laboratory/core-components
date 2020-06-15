import React from 'react';
import { BaseOptgroupProps } from '../../typings';

import styles from './index.module.css';

export const Optgroup = ({ children, label }: BaseOptgroupProps) => {
    return (
        <React.Fragment>
            <div className={styles.optgroup}>
                <span className={styles.label}>{label}</span>
            </div>
            {children}
        </React.Fragment>
    );
};
