import React, { FC, MouseEvent, useMemo } from 'react';
import cn from 'classnames';
import { IconButton } from '@alfalab/core-components-icon-button';
import { endOfWeek, startOfWeek } from 'date-fns';
import { ChevronBackMIcon } from '@alfalab/icons-glyph/ChevronBackMIcon';
import { SelectButton } from '../select-button';
import { monthName } from '../../utils';
import { formatPeriod, shiftValues } from './utils';

import styles from './index.module.css';

export type PeriodType = 'range' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export type PeriodSliderProps = {
    /**
     * Активная дата или период
     */
    value?: Date | [Date, Date];

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
    const [valueFrom, valueTo] = useMemo(() => {
        let from: Date;
        let to: Date;

        if (!value) return [undefined, undefined];

        if (Array.isArray(value)) {
            [from, to] = value;
        } else {
            [from, to] = [value, value];

            if (periodType === 'week') {
                from = startOfWeek(from, { weekStartsOn: 1 });
                to = endOfWeek(from, { weekStartsOn: 1 });
            }
        }

        return [from, to];
    }, [periodType, value]);

    const month = valueFrom ? monthName(valueFrom) : undefined;
    const year = valueFrom ? valueFrom.getFullYear().toString() : undefined;

    const showPrevButton = !(hideDisabledArrows && (prevArrowDisabled || !valueFrom));
    const showNextButton = !(hideDisabledArrows && (nextArrowDisabled || !valueFrom));

    const handleNextArrowClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (!valueFrom || !valueTo) return;

        const newValues = shiftValues(valueFrom, valueTo, periodType, 'next');

        onNextArrowClick(event, {
            value: newValues.valueFrom,
            valueFrom: newValues.valueFrom,
            valueTo: newValues.valueTo,
            periodType,
        });
    };

    const handlePrevArrowClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (!valueFrom || !valueTo) return;

        const newValues = shiftValues(valueFrom, valueTo, periodType, 'prev');

        onPrevArrowClick(event, {
            value: newValues.valueFrom,
            valueFrom: newValues.valueFrom,
            valueTo: newValues.valueTo,
            periodType,
        });
    };

    const renderHeader = () => {
        if (!valueFrom || !valueTo) {
            return <span className={cn(styles.period, styles.empty)}>Укажите период</span>;
        }

        return view === 'full' ? (
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
            <span className={styles.period}>{periodFormatter(valueFrom, valueTo, periodType)}</span>
        );
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
                <IconButton
                    size="xs"
                    className={styles.arrow}
                    icon={ChevronBackMIcon}
                    onClick={handlePrevArrowClick}
                    disabled={prevArrowDisabled || !valueFrom}
                    aria-label='Предыдущий период'
                />
            )}

            {renderHeader()}

            {showNextButton && (
                <IconButton
                    size="xs"
                    className={styles.arrow}
                    icon={ChevronBackMIcon}
                    onClick={handleNextArrowClick}
                    disabled={nextArrowDisabled || !valueFrom}
                    aria-label='Следующий период'
                />
            )}
        </div>
    );
};
