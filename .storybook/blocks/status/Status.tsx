import React, { ReactNode } from 'react';
import cn from 'classnames';

import styles from './Status.css';

const STATUS = {
    1: 'Draft',
    2: 'Candidate Recommendation',
    3: 'Proposed Recommendation',
    4: 'Recommendation',
};

type StatusProps = {
    stage: number;
};

export const Status: React.FC<StatusProps> = ({ stage }) => (
    <div className={cn(styles.status)}>
        <a
            className={cn(styles.link, styles[`stage${stage}`])}
            href='./?path=/docs/гайдлайны-статусы--page'
        >
            {STATUS[stage]}
        </a>
    </div>
);
