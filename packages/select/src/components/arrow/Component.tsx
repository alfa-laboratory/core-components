import React from 'react';
import cn from 'classnames';
import { ArrowProps } from '../../typings';

import styles from './index.module.css';

export const Arrow = ({ open, className }: ArrowProps) => (
    <span className={cn(styles.arrow, className, { [styles.open]: open })} />
);
