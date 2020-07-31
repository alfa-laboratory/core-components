import React from 'react';
import cn from 'classnames';
import { TabProps } from '../../typings';

import styles from './index.module.css';

export const Tab = ({ children, hidden, className }: TabProps) => (
    <div
        className={cn(
            styles.component,
            {
                [styles.hidden]: hidden,
            },
            className,
        )}
        hidden={hidden}
        role='tabpanel'
        tabIndex={0}
    >
        {children}
    </div>
);
