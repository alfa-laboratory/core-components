import React, { FC } from 'react';
import cn from 'classnames';

import { Typography } from '@alfalab/core-components-typography';

import { StepBar } from './components/step-bar';

import styles from './index.module.css';

export type SteppedProgressBarProps = {
    /**
     * Общее количество шагов
     */
    maxStep: number;

    /**
     * Описание под прогрессбаром
     */
    description?: string;

    /**
     * Количество пройденных шагов
     */
    step?: number;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;

    /**
     * Дополнительный класс
     */
    className?: string;
};

export const SteppedProgressBar: FC<SteppedProgressBarProps> = ({
    maxStep,
    description,
    step = 0,
    dataTestId,
    className,
}) => {
    const validMaxSteps = maxStep <= 0 ? 1 : maxStep;

    return (
        <div className={cn(styles.component, className)} data-test-id={dataTestId}>
            <div className={styles.stepsContainer}>
                {Array.from(Array(validMaxSteps), (_, index) => (
                    <StepBar key={index} isDone={index < step} />
                ))}
            </div>
            {description && (
                <Typography.Text tag='div' className={styles.description} view='primary-small'>
                    {description}
                </Typography.Text>
            )}
        </div>
    );
};
