import React from 'react';
import cn from 'classnames';
import ArrowIcon from '@alfalab/icons-classic/ArrowDownMBlackIcon';
import { ArrowProps } from '../../typings';

import styles from './index.module.css';

export const Arrow = ({ open }: ArrowProps) => (
    <ArrowIcon className={cn(styles.arrow, { [styles.open]: open })} />
);
