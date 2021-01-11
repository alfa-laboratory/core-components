import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { setMonth, startOfMonth, addMonths, setDate, endOfMonth, startOfDay } from 'date-fns';
import { MONTHS } from '../../calendar/src/utils';
import { formatDate } from '../../calendar-input/src/utils';

import { CalendarRange } from './index';

describe('CalendarRange', () => {
    const defaultDate = new Date('October 01, 2020 00:00:00');
    const currentDate = new Date();
    const currentMonth = startOfMonth(currentDate);
    const nextMonth = addMonths(currentMonth, 1);
    const currentMonthName = MONTHS[currentMonth.getMonth()];
    const nextMonthName = MONTHS[nextMonth.getMonth()];

    describe('Display tests', () => {
        it('should match snapshot', () => {
            expect(
                render(<CalendarRange defaultMonth={defaultDate.getTime()} />).container,
            ).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` attribute', () => {
        const testId = 'test-id';
        const { getByTestId } = render(<CalendarRange dataTestId={testId} />);

        expect(getByTestId(testId)).toBeInTheDocument();
    });

    it('should set custom class', () => {
        const className = 'custom-class';
        const { container } = render(<CalendarRange className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should pass custom props to CalendarInputs', () => {
        const { queryByText } = render(
            <CalendarRange
                inputFromProps={{ error: 'errorFrom' }}
                inputToProps={{ error: 'errorTo' }}
            />,
        );

        expect(queryByText('errorFrom')).toBeInTheDocument();
        expect(queryByText('errorTo')).toBeInTheDocument();
    });

    it('should open current and next month by default', () => {
        const { container } = render(<CalendarRange />);

        expect(container).toHaveTextContent(currentMonthName);
        expect(container).toHaveTextContent(nextMonthName);
    });

    it('should open defaultMonth and next month', () => {
        const defaultMonth = setMonth(startOfMonth(new Date()), 4).getTime();

        const { container } = render(<CalendarRange defaultMonth={defaultMonth} />);

        expect(container).toHaveTextContent('Май');
        expect(container).toHaveTextContent('Июнь');
    });

    it('should navigate months by arrows', () => {
        const defaultMonth = setMonth(startOfMonth(new Date()), 4).getTime();

        const { container, queryByLabelText } = render(
            <CalendarRange defaultMonth={defaultMonth} />,
        );

        const prevMonthButton = queryByLabelText('Предыдущий месяц') as HTMLButtonElement;
        const nextMonthButton = queryByLabelText('Следующий месяц') as HTMLButtonElement;

        prevMonthButton.click();

        expect(container).toHaveTextContent('Апрель');
        expect(container).toHaveTextContent('Май');

        prevMonthButton.click();

        expect(container).toHaveTextContent('Март');
        expect(container).toHaveTextContent('Апрель');

        nextMonthButton.click();

        expect(container).toHaveTextContent('Апрель');
        expect(container).toHaveTextContent('Май');

        nextMonthButton.click();

        expect(container).toHaveTextContent('Май');
        expect(container).toHaveTextContent('Июнь');
    });

    it('should use minDate', () => {
        const defaultMonth = setMonth(startOfMonth(new Date()), 4).getTime();
        const minDate = setDate(defaultMonth, 5).getTime();

        const { container, queryByLabelText } = render(
            <CalendarRange defaultMonth={defaultMonth} minDate={minDate} />,
        );

        const prevMonthButton = queryByLabelText('Предыдущий месяц') as HTMLButtonElement;

        const firstNonDisabledDayButton = container.querySelector(
            '*[data-date]:not(:disabled)',
        ) as HTMLButtonElement;
        const date = firstNonDisabledDayButton.dataset.date as string;

        expect(prevMonthButton).toBeFalsy();
        expect(firstNonDisabledDayButton).toHaveTextContent('5');
        expect(new Date(+date).getTime()).toBe(minDate);
    });

    it('should use maxDate', () => {
        const defaultMonth = setMonth(startOfMonth(new Date()), 4).getTime();
        const maxDate = setDate(addMonths(defaultMonth, 1), 25).getTime();

        const { container, queryByLabelText } = render(
            <CalendarRange defaultMonth={defaultMonth} maxDate={maxDate} />,
        );

        const nextMonthButton = queryByLabelText('Следующий месяц') as HTMLButtonElement;

        const activeDays = container.querySelectorAll('*[data-date]:not(:disabled)');
        const lastActiveDay = activeDays[activeDays.length - 1] as HTMLButtonElement;
        const date = lastActiveDay.dataset.date as string;

        expect(nextMonthButton).toBeFalsy();
        expect(lastActiveDay).toHaveTextContent('25');
        expect(new Date(+date).getTime()).toBe(maxDate);
    });

    it('should use valueFrom', () => {
        const valueFrom = setDate(currentMonth, 10).getTime();

        const { container } = render(<CalendarRange valueFrom={formatDate(valueFrom)} />);

        const selectedDay = container.querySelector(
            '*[data-date][aria-selected="true"]',
        ) as HTMLButtonElement;

        const date = selectedDay.dataset.date as string;

        expect(selectedDay).toHaveTextContent('10');
        expect(new Date(+date).getTime()).toBe(valueFrom);
    });

    it('should use valueTo', () => {
        const valueTo = setDate(nextMonth, 10).getTime();

        const { container } = render(<CalendarRange valueTo={formatDate(valueTo)} />);

        const selectedDay = container.querySelector(
            '*[data-date][aria-selected="true"]',
        ) as HTMLButtonElement;

        const date = selectedDay.dataset.date as string;

        expect(selectedDay).toHaveTextContent('10');
        expect(new Date(+date).getTime()).toBe(valueTo);
    });

    it('should use valueFrom and valueTo both', () => {
        const valueFrom = setDate(currentMonth, 10).getTime();
        const valueTo = setDate(nextMonth, 7).getTime();

        const { container } = render(
            <CalendarRange valueFrom={formatDate(valueFrom)} valueTo={formatDate(valueTo)} />,
        );

        const selectedDays = container.querySelectorAll('*[data-date][aria-selected="true"]');

        const dayFrom = selectedDays[0] as HTMLButtonElement;
        const dayTo = selectedDays[1] as HTMLButtonElement;

        const dateFrom = dayFrom.dataset.date as string;
        const dateTo = dayTo.dataset.date as string;

        expect(selectedDays).toHaveLength(2);
        expect(dayFrom).toHaveTextContent('10');
        expect(dayTo).toHaveTextContent('7');
        expect(new Date(+dateFrom).getTime()).toBe(valueFrom);
        expect(new Date(+dateTo).getTime()).toBe(valueTo);
    });

    it('should open month of valueFrom', () => {
        const valueFrom = setMonth(startOfMonth(new Date()), 4).getTime();

        const { container } = render(<CalendarRange valueFrom={formatDate(valueFrom)} />);

        expect(container).toHaveTextContent('Май');
        expect(container).toHaveTextContent('Июнь');
    });

    describe('Period selection', () => {
        it('should select day, fill inputFrom and start selection on first click', () => {
            const { container, queryAllByRole } = render(<CalendarRange />);

            const days = container.querySelectorAll('*[data-date]');
            const inputFrom = queryAllByRole('textbox')[0] as HTMLInputElement;

            act(() => {
                (days[0] as HTMLButtonElement).click();
            });

            expect(days[0]).toHaveAttribute('aria-selected', 'true');
            expect(inputFrom).toHaveValue(formatDate(currentMonth));

            fireEvent.mouseEnter(days[1]);

            expect(days[0]).toHaveClass('rangeStart');
            expect(days[1]).toHaveClass('range');
        });

        it('should unselected day, clear input and cancel selection if clicked on same day', () => {
            const { container, queryAllByRole } = render(<CalendarRange />);

            const days = container.querySelectorAll('*[data-date]');
            const inputFrom = queryAllByRole('textbox')[0] as HTMLInputElement;

            act(() => {
                (days[0] as HTMLButtonElement).click();
            });

            act(() => {
                (days[0] as HTMLButtonElement).click();
            });

            expect(days[0]).not.toHaveAttribute('aria-selected');
            expect(inputFrom).toHaveValue('');

            fireEvent.mouseEnter(days[1]);

            expect(days[1]).not.toHaveClass('range');
        });

        it('should select new day, change inputFrom value and start new selection if clicked date < start date', () => {
            const { container, queryAllByRole } = render(<CalendarRange />);

            const days = container.querySelectorAll('*[data-date]');
            const inputFrom = queryAllByRole('textbox')[0] as HTMLInputElement;

            act(() => {
                (days[1] as HTMLButtonElement).click();
            });

            act(() => {
                (days[0] as HTMLButtonElement).click();
            });

            expect(days[0]).toHaveAttribute('aria-selected', 'true');
            expect(days[1]).toHaveAttribute('aria-selected', 'false');
            expect(inputFrom).toHaveValue(formatDate(startOfMonth(currentMonth)));

            fireEvent.mouseEnter(days[1]);

            expect(days[0]).toHaveClass('rangeStart');
            expect(days[1]).not.toHaveClass('rangeStart');
            expect(days[1]).toHaveClass('range');
        });

        it('should select day, fill inputTo and end selection if clicked date > start date', () => {
            const { container, queryAllByRole } = render(<CalendarRange />);

            const days = container.querySelectorAll('*[data-date]');
            const inputTo = queryAllByRole('textbox')[1] as HTMLInputElement;

            act(() => {
                (days[0] as HTMLButtonElement).click();
            });

            act(() => {
                (days[days.length - 1] as HTMLButtonElement).click();
            });

            expect(days[days.length - 1]).toHaveAttribute('aria-selected');
            expect(inputTo).toHaveValue(formatDate(endOfMonth(nextMonth)));

            Array.from(days)
                .slice(1, -1)
                .forEach(day => expect(day).toHaveClass('range'));
        });

        it('should keep selection when month changed', async () => {
            const { container, queryByLabelText } = render(<CalendarRange />);

            const firstDay = container.querySelector('*[data-date]') as HTMLButtonElement;
            const nextMonthButton = queryByLabelText('Следующий месяц') as HTMLButtonElement;

            act(() => {
                firstDay.click();
            });

            nextMonthButton.click();
            await new Promise(res => setTimeout(res, 1000));

            const days = container.querySelectorAll('*[data-date]');
            const lastDay = days[days.length - 1] as HTMLButtonElement;
            const lastDayDate = new Date(+(lastDay.dataset.date as string));

            lastDay.click();

            expect(lastDayDate.getTime()).toBe(
                startOfDay(endOfMonth(addMonths(currentMonth, 2))).getTime(),
            );

            Array.from(days)
                .slice(0, -1)
                .forEach(day => expect(day).toHaveClass('range'));
        });
    });

    describe('Callback tests', () => {
        it('should call onDateFromChange callback', () => {
            const cb = jest.fn();
            const { container } = render(<CalendarRange onDateFromChange={cb} />);

            const calendars = container.querySelectorAll('table');
            (calendars[0].querySelector('*[data-date]') as HTMLButtonElement).click();
            (calendars[1].querySelector('*[data-date]') as HTMLButtonElement).click();

            expect(cb).toBeCalledTimes(1);

            const { date } = cb.mock.calls[0][0];

            expect(MONTHS[new Date(date).getMonth()]).toBe(currentMonthName);
        });

        it('should call onDateToChange callback', () => {
            const cb = jest.fn();
            const { container } = render(<CalendarRange onDateToChange={cb} />);

            const calendars = container.querySelectorAll('table');
            (calendars[0].querySelector('*[data-date]') as HTMLButtonElement).click();
            (calendars[1].querySelector('*[data-date]') as HTMLButtonElement).click();

            expect(cb).toBeCalledTimes(1);

            const { date } = cb.mock.calls[0][0];

            expect(MONTHS[new Date(date).getMonth()]).toBe(nextMonthName);
        });
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<CalendarRange />);

            expect(unmount).not.toThrowError();
        });
    });
});
