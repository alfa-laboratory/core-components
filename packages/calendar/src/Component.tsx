import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { setYear } from 'date-fns';
import { Header } from './components/header';
import { DaysTable } from './components/days-table';
import { MonthsTable } from './components/months-table';
import { YearsTable } from './components/years-table';
import { useCalendar } from './useCalendar';
import { monthName, useDidUpdateEffect } from './utils';

import styles from './index.module.css';

type View = 'years' | 'months' | 'days';

export type CalendarProps = {
    className?: string;

    defaultView?: View;

    selectorView?: 'month-only' | 'full';

    value?: number;

    minDate?: number;

    maxDate?: number;

    selectedFrom?: number;

    selectedTo?: number;

    events?: Array<Date | number>;

    offDays?: Array<Date | number>;

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
}) => {
    const [view, setView] = useState<View>(defaultView);
    const [scrolled, setScrolled] = useState(false);

    const {
        month,
        weeks,
        months,
        years,
        canSetPrevMonth,
        canSetNextMonth,
        setPrevMonth,
        setNextMonth,
        setMonthByDate,
        getDayProps,
        highlighted,
    } = useCalendar({
        defaultMonth: value ? new Date(value) : undefined,
        minDate: minDate ? new Date(minDate) : undefined,
        maxDate: maxDate ? new Date(maxDate) : undefined,
        selected: value ? new Date(value) : undefined,
        offDays,
        events,
        onChange,
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

    const handleMonthSelect = useCallback(
        (newMonth: Date) => {
            setMonthByDate(newMonth);
        },
        [setMonthByDate],
    );

    const handleYearSelect = useCallback(
        (newYear: Date) => {
            setMonthByDate(setYear(month, newYear.getFullYear()));
        },
        [month, setMonthByDate],
    );

    useDidUpdateEffect(() => {
        setView('days');
    }, [month]);

    useDidUpdateEffect(() => {
        setScrolled(false);
    }, [view]);

    return (
        <div
            className={cn(styles.component, className, {
                [styles.sixWeeks]: weeks.length === 6,
            })}
        >
            <Header
                month={monthName(month)}
                year={month.getFullYear().toString()}
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
                        selectedMonth={month}
                        months={months}
                        onMonthClick={handleMonthSelect}
                    />
                )}

                {view === 'years' && (
                    <YearsTable
                        selectedYear={month}
                        years={years}
                        onYearClick={handleYearSelect}
                        onScroll={handleScroll}
                    />
                )}
            </div>
        </div>
    );
};
