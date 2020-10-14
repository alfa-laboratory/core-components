import React from 'react';
import cn from 'classnames';
import { OptgroupProps } from '../../typings';

import styles from './index.module.css';

export const Optgroup = ({ children, label, size = 's' }: OptgroupProps) => (
    <React.Fragment>
        <div className={cn(styles.optgroup, styles[size])}>
            <span className={styles.label}>{label}</span>
        </div>
        {children}
    </React.Fragment>
);
