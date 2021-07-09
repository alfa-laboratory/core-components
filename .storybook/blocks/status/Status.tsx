import React, { ReactNode } from 'react';
import cn from 'classnames';

import styles from './Status.module.css';

const STATUS = {
    1: 'Draft',
    2: 'Candidate',
    3: 'Recommendation',
};

type StatusProps = {
    stage: number;
};

export const Status: React.FC<StatusProps> = ({ stage }) => (
    <div className={styles.status}>
        <a
            className={cn(styles.link, styles[`stage${stage}`])}
            href='./?path=/docs/гайдлайны-статусы--page'
        >
            {STATUS[stage]}
        </a>
    </div>
);
