import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { Header } from './components/header';
import { DaysTable } from './components/days-table';
import { MonthsTable } from './components/months-table';
import { YearsTable } from './components/years-table';
import { useCalendar } from './useCalendar';

import styles from './index.module.css';
import { monthName, setYear, startOfDay } from './utils';

type View = 'years' | 'months' | 'days';

export type CalendarProps = {
    className?: string;

    defaultView?: View;

    value?: Date | number;

    selectedFrom?: Date | number;

    selectedTo?: Date | number;
};

const minDate = startOfDay(new Date());
minDate.setFullYear(2019);
minDate.setMonth(8);

const maxDate = startOfDay(new Date());
maxDate.setMonth(11);

const events = [new Date().setDate(4), new Date().setDate(10), new Date().setDate(15)];

const offDays = [new Date().setDate(1), new Date().setDate(7), new Date().setDate(28)];

export const Calendar: FC<CalendarProps> = ({
    className,
    defaultView = 'days',
    value,
    selectedFrom,
    selectedTo,
}) => {
    const [view, setView] = useState<View>(defaultView);

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
    } = useCalendar({
        minDate,
        maxDate,
        events,
        offDays,
    });

    const toggleView = useCallback(
        (newView: View) => {
            setView(view === newView ? 'days' : newView);
        },
        [view],
    );

    const handlePrevArrowClick = useCallback(() => {
        // TODO: Что должны делать стрелки при view !== days?
        setPrevMonth();
        setView('days');
    }, [setPrevMonth]);

    const handleNextArrowClick = useCallback(() => {
        setNextMonth();
        setView('days');
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
            setView('days');
        },
        [setMonthByDate],
    );

    const handleYearSelect = useCallback(
        (newYear: Date) => {
            setMonthByDate(setYear(month, newYear.getFullYear()));
            setView('days');
        },
        [month, setMonthByDate],
    );

    return (
        <div className={cn(styles.component, className)}>
            <Header
                month={monthName(month)}
                year={month.getFullYear().toString()}
                prevArrowVisible={canSetPrevMonth}
                nextArrowVisible={canSetNextMonth}
                onPrevArrowClick={handlePrevArrowClick}
                onNextArrowClick={handleNextArrowClick}
                onMonthClick={handleMonthClick}
                onYearClick={handleYearClick}
                view={years.length > 1 ? 'full' : 'month-only'}
            />
            {view === 'days' && (
                <DaysTable
                    weeks={weeks}
                    selected={value}
                    selectedFrom={selectedFrom}
                    selectedTo={selectedTo}
                />
            )}
            {view === 'months' && <MonthsTable months={months} onMonthClick={handleMonthSelect} />}
            {view === 'years' && <YearsTable years={years} onYearClick={handleYearSelect} />}
        </div>
    );
};
