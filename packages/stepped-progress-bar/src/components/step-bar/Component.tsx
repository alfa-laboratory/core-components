import React, { FC } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type StepBarProps = {
    isDone: boolean;
};

export const StepBar: FC<StepBarProps> = React.memo(({ isDone }) => (
    <span className={cn(styles.bar, isDone && styles.done)} />
));
