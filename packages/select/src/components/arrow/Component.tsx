import React from 'react';
import cn from 'classnames';
import ArrowIcon from '@alfalab/icons-classic/ArrowDownMBlackIcon';
import { BaseArrowProps } from '../../typings';

import styles from './index.module.css';

export type ArrowProps = BaseArrowProps;

export const Arrow = ({ open }: ArrowProps) => {
    return <ArrowIcon className={cn(styles.arrow, { [styles.open]: open })} />;
};
