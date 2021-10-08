import React from 'react';
import cn from 'classnames';
import { ChevronDownMIcon } from '@alfalab/icons-glyph/ChevronDownMIcon';
import { ArrowProps } from '../../typings';

import styles from './index.module.css';

export const Arrow = ({ open, className }: ArrowProps) => (
    <ChevronDownMIcon className={cn(styles.arrow, className, { [styles.open]: open })} />
);
