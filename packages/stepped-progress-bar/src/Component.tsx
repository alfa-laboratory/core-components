import React, { FC } from 'react';
import cn from 'classnames';

import { Typography } from '@alfalab/core-components-typography';

import { StepBar } from './components/step-bar';

import styles from './index.module.css';

export type SteppedProgressBarView =
    | 'positive'
    | 'negative'
    | 'attention'
    | 'link'
    | 'tertiary'
    | 'secondary'
    | 'primary'
    | 'accent';

export type SteppedProgressBarProps = {
    /**
     * Общее количество шагов
     */
    maxStep: number;

    /**
     * Постфикс описание под прогрессбаром
     */
    description?: string;

    /**
     * Количество пройденных шагов
     */
    step?: number;

    /**
     * Цвет заполнения
     */
    view?: SteppedProgressBarView | SteppedProgressBarView[];

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
    view,
    dataTestId,
    className,
}) => {
    const validMaxSteps = maxStep <= 0 ? 1 : maxStep;
    const isViewString = typeof view === 'string';

    return (
        <div className={cn(styles.component, className)} data-test-id={dataTestId}>
            <div className={styles.stepsContainer}>
                {Array.from(Array(validMaxSteps), (_, index) => (
                    <StepBar
                        key={index}
                        isDone={index < step}
                        view={(isViewString ? view : view?.[index]) as SteppedProgressBarView}
                    />
                ))}
            </div>
            {description && (
                <Typography.Text tag='div' className={styles.description} view='primary-small'>
                    Шаг {step} из {maxStep}: {description}
                </Typography.Text>
            )}
        </div>
    );
};
