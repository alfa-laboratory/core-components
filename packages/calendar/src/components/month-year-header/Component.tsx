import React, { FC, MouseEvent } from 'react';
import cn from 'classnames';
import { ChevronDownCompactSIcon } from '@alfalab/icons-glyph/ChevronDownCompactSIcon';
import { SelectButton } from '../select-button';
import { monthName } from '../../utils';

import styles from './index.module.css';

export type MonthYearHeaderProps = {
    /**
     * Активная дата
     */
    value?: Date;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Обработчик нажатия на кнопку месяца
     */
    onMonthClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Обработчик нажатия на кнопку года
     */
    onYearClick?: (event: MouseEvent<HTMLButtonElement>) => void;

    /**
     * Идентификатор для систем автоматизированного тестирования
     */
    dataTestId?: string;
};

export const MonthYearHeader: FC<MonthYearHeaderProps> = ({
    value,
    className,
    onMonthClick,
    onYearClick,
    dataTestId,
}) => {
    const month = value ? monthName(value) : undefined;
    const year = value ? value.getFullYear().toString() : undefined;

    return (
        <div
            className={cn(styles.component, className)}
            aria-live='polite'
            data-test-id={dataTestId}
        >
            <SelectButton
                view='filled'
                className={cn(styles.button, styles.month)}
                onClick={onMonthClick}
            >
                <span className={styles.buttonContent}>
                    {month}
                    <ChevronDownCompactSIcon className={styles.upDownIcon} />
                </span>
            </SelectButton>
            <SelectButton
                view='filled'
                className={cn(styles.button, styles.year)}
                onClick={onYearClick}
            >
                <span className={styles.buttonContent}>
                    {year}
                    <ChevronDownCompactSIcon className={styles.upDownIcon} />
                </span>
            </SelectButton>
        </div>
    );
};
