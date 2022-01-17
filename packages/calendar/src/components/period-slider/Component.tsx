import React, { FC, MouseEvent } from 'react';
import cn from 'classnames';
import { Button } from '@alfalab/core-components-button';
import { endOfWeek, startOfWeek } from 'date-fns';
import { SelectButton } from '../select-button';
import { monthName } from '../../utils';
import { formatPeriod, shiftValues } from './utils';

import styles from './index.module.css';

export type PeriodType = 'range' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export type PeriodSliderProps = {
    /**
     * Активная дата или период
     */
    value: Date | [Date, Date];

    /**
     * Вид шапки — с кнопками выбора года и месяца или только период
     */
    view?: 'full' | 'period';

    /**
     * Тип периода
     */
    periodType?: PeriodType;

    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Отключает кнопку назад
     */
    prevArrowDisabled?: boolean;

    /**
     * Отключает кнопку вперед
     */
    nextArrowDisabled?: boolean;

    /**
     * Скрывает заблокированные кнопки
     */
    hideDisabledArrows?: boolean;

    /**
     * Функция для форматирование выбранного периода
     */
    periodFormatter?: (valueFrom: Date, valueTo: Date, periodType: PeriodType) => string;

    /**
     * Обработчик нажатия кнопки переключения на назад
     */
    onPrevArrowClick?: (
        event: MouseEvent<HTMLButtonElement>,
        payload: {
            value: Date;
            valueFrom: Date;
            valueTo: Date;
            periodType: PeriodType;
        },
    ) => void;

    /**
     * Обработчик нажатия кнопки переключения на вперед
     */
    onNextArrowClick?: (
        event: MouseEvent<HTMLButtonElement>,
        payload: {
            value: Date;
            valueFrom: Date;
            valueTo: Date;
            periodType: PeriodType;
        },
    ) => void;

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

export const PeriodSlider: FC<PeriodSliderProps> = ({
    value,
    view = 'month-only',
    periodType = 'month',
    className,
    periodFormatter = formatPeriod,
    prevArrowDisabled = false,
    nextArrowDisabled = false,
    hideDisabledArrows = false,
    onPrevArrowClick = () => null,
    onNextArrowClick = () => null,
    onMonthClick,
    onYearClick,
    dataTestId,
}) => {
    let valueFrom: Date;
    let valueTo: Date;

    if (Array.isArray(value)) {
        [valueFrom, valueTo] = value;
    } else {
        [valueFrom, valueTo] = [value, value];

        if (periodType === 'week') {
            valueFrom = startOfWeek(valueFrom, { weekStartsOn: 1 });
            valueTo = endOfWeek(valueFrom, { weekStartsOn: 1 });
        }
    }

    const month = monthName(valueFrom);
    const year = valueFrom.getFullYear().toString();

    const showPrevButton = !(hideDisabledArrows && prevArrowDisabled);
    const showNextButton = !(hideDisabledArrows && nextArrowDisabled);

    const handleNextArrowClick = (event: MouseEvent<HTMLButtonElement>) => {
        const newValues = shiftValues(valueFrom, valueTo, periodType, 'next');

        onNextArrowClick(event, {
            value: newValues.valueFrom,
            valueFrom: newValues.valueFrom,
            valueTo: newValues.valueTo,
            periodType,
        });
    };

    const handlePrevArrowClick = (event: MouseEvent<HTMLButtonElement>) => {
        const newValues = shiftValues(valueFrom, valueTo, periodType, 'prev');

        onPrevArrowClick(event, {
            value: newValues.valueFrom,
            valueFrom: newValues.valueFrom,
            valueTo: newValues.valueTo,
            periodType,
        });
    };

    return (
        <div
            className={cn(styles.component, className, {
                [styles.full]: view === 'full',
            })}
            aria-live='polite'
            data-test-id={dataTestId}
        >
            {showPrevButton && (
                <Button
                    view='ghost'
                    className={styles.arrow}
                    onClick={handlePrevArrowClick}
                    disabled={prevArrowDisabled}
                    aria-label='Предыдущий период'
                />
            )}

            {view === 'full' ? (
                <React.Fragment>
                    <SelectButton view='filled' className={styles.month} onClick={onMonthClick}>
                        <span className={styles.buttonContent}>
                            {month}
                            <span className={styles.upDownIcon} />
                        </span>
                    </SelectButton>
                    <SelectButton view='filled' className={styles.year} onClick={onYearClick}>
                        <span className={styles.buttonContent}>
                            {year}
                            <span className={styles.upDownIcon} />
                        </span>
                    </SelectButton>
                </React.Fragment>
            ) : (
                <span className={styles.period}>
                    {periodFormatter(valueFrom, valueTo, periodType)}
                </span>
            )}

            {showNextButton && (
                <Button
                    view='ghost'
                    className={styles.arrow}
                    onClick={handleNextArrowClick}
                    disabled={nextArrowDisabled}
                    aria-label='Следующий период'
                />
            )}
        </div>
    );
};
