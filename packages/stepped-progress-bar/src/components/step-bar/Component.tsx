import React, { FC, memo } from 'react';
import cn from 'classnames';

import styles from './index.module.css';
import { SteppedProgressBarView } from '../../Component';

type StepBarProps = {
    isDone: boolean;
    view?: SteppedProgressBarView;
};

export const StepBar: FC<StepBarProps> = memo(({ isDone, view = 'positive' }) => (
    <span data-test-id={isDone ? 'on' : 'off'} className={cn(styles.bar, isDone && styles[view])} />
));
