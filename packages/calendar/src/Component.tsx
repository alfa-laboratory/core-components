import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { Header } from './components/header';
import { DaysTable } from './components/days-table';
import { MonthsTable } from './components/months-table';
import { YearsTable } from './components/years-table';
import { useCalendar } from './useCalendar';
import { monthName, useDidUpdateEffect } from './utils';
import { View } from './typings';

import styles from './index.module.css';

export type CalendarProps = {
    /**
     * Дополнительный класс
     */
    className?: string;

    /**
     * Вид по умолчанию (выбор дней, месяцев, лет)
     */
    defaultView?: View;

    /**
     * Вид шапки — месяц и год или только месяц
     */
    selectorView?: 'month-only' | 'full';

    /**
     * Выбранная дата
     */
    value?: number;

    /**
     * Минимальная дата, доступная для выбора
     */
    minDate?: number;

    /**
     * Максимальная дата, доступная для выбора
     */
    maxDate?: number;

    /**
     * Начало выделенного периода
     */
    selectedFrom?: number;

    /**
     * Конец выделенного периода
     */
    selectedTo?: number;

    /**
     * Список событий
     */
    events?: Array<Date | number>;

    /**
     * Список выходных
     */
    offDays?: Array<Date | number>;

    /**
     * Обработчик изменения месяца (или года)
     */
    onMonthChange?: (month: number) => void;

    /**
     * Обработчик выбора даты
     */
    onChange?: (date: number) => void;
};

export const Calendar: FC<CalendarProps> = ({
    className,
    defaultView = 'days',
    selectorView = 'full',
    value,
    minDate,
    maxDate,
    selectedFrom,
    selectedTo,
    offDays,
    events,
    onChange,
    onMonthChange,
}) => {
    const [view, setView] = useState<View>(defaultView);
    const [scrolled, setScrolled] = useState(false);

    const {
        activeMonth,
        weeks,
        months,
        years,
        canSetPrevMonth,
        canSetNextMonth,
        setPrevMonth,
        setNextMonth,
        highlighted,
        getDayProps,
        getMonthProps,
        getYearProps,
        getRootProps,
    } = useCalendar({
        view,
        defaultMonth: value ? new Date(value) : undefined,
        minDate: minDate ? new Date(minDate) : undefined,
        maxDate: maxDate ? new Date(maxDate) : undefined,
        selected: value ? new Date(value) : undefined,
        offDays,
        events,
        onChange,
        onMonthChange,
    });

    const toggleView = useCallback(
        (newView: View) => {
            setView(view === newView ? 'days' : newView);
        },
        [view],
    );

    const handleScroll = useCallback(event => {
        setScrolled(event.target.scrollTop > 0);
    }, []);

    const handlePrevArrowClick = useCallback(() => {
        // TODO: Что должны делать стрелки при view !== days?
        setPrevMonth();
    }, [setPrevMonth]);

    const handleNextArrowClick = useCallback(() => {
        setNextMonth();
    }, [setNextMonth]);

    const handleMonthClick = useCallback(() => {
        toggleView('months');
    }, [toggleView]);

    const handleYearClick = useCallback(() => {
        toggleView('years');
    }, [toggleView]);

    useDidUpdateEffect(() => {
        setView('days');
    }, [activeMonth]);

    useDidUpdateEffect(() => {
        setScrolled(false);
    }, [view]);

    return (
        <div
            className={cn(styles.component, className, {
                [styles.sixWeeks]: weeks.length === 6,
            })}
            {...getRootProps()}
        >
            <Header
                month={monthName(activeMonth)}
                year={activeMonth.getFullYear().toString()}
                prevArrowVisible={canSetPrevMonth}
                nextArrowVisible={canSetNextMonth}
                onPrevArrowClick={handlePrevArrowClick}
                onNextArrowClick={handleNextArrowClick}
                onMonthClick={handleMonthClick}
                onYearClick={handleYearClick}
                view={selectorView}
                withShadow={scrolled}
            />

            <div className={styles.container}>
                {view === 'days' && (
                    <DaysTable
                        weeks={weeks}
                        selectedFrom={selectedFrom}
                        selectedTo={selectedTo}
                        getDayProps={getDayProps}
                        highlighted={highlighted}
                    />
                )}

                {view === 'months' && (
                    <MonthsTable
                        selectedMonth={activeMonth}
                        months={months}
                        getMonthProps={getMonthProps}
                    />
                )}

                {view === 'years' && (
                    <YearsTable
                        selectedYear={activeMonth}
                        years={years}
                        getYearProps={getYearProps}
                        onScroll={handleScroll}
                    />
                )}
            </div>
        </div>
    );
};
