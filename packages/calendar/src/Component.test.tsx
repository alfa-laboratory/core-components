import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { subDays, addDays, setDate } from 'date-fns';
import { act } from 'react-dom/test-utils';
import { monthName, MONTHS } from './utils';
import { View, SelectorView } from './typings';

import { Calendar } from './index';

describe('Calendar', () => {
    const defaultDate = new Date('November 30, 2020 00:00:00');
    const defaultValue = defaultDate.getTime();
    const defaultDateOfMonth = defaultDate.getDate().toString();
    const defaultMonth = monthName(defaultDate).toString();
    const defaultYear = defaultDate.getFullYear().toString();

    describe('Display tests', () => {
        it('should match snapshot', () => {
            expect(render(<Calendar value={defaultValue} />).container).toMatchSnapshot();
        });

        it.each(['days', 'months', 'years'])('should match defaultView="%s" snapshot', view => {
            expect(
                render(<Calendar value={defaultValue} defaultView={view as View} />).container,
            ).toMatchSnapshot();
        });

        it.each(['month-only', 'full'])('should match selectorView="%s" snapshot', view => {
            expect(
                render(<Calendar value={defaultValue} selectorView={view as SelectorView} />)
                    .container,
            ).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` attribute', () => {
        const testId = 'test-id';
        const { getByTestId } = render(<Calendar dataTestId={testId} />);

        expect(getByTestId(testId)).toBeInTheDocument();
    });

    it('should set custom class', () => {
        const className = 'custom-class';
        const { container } = render(<Calendar className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should open current month by default', () => {
        const { queryByRole } = render(<Calendar />);

        const now = new Date();
        const currentDate = now.getDate().toString();
        const currentMonth = monthName(now).toString();
        const currentYear = now.getFullYear().toString();

        expect(queryByRole('button', { name: currentYear })).toBeInTheDocument();
        expect(queryByRole('button', { name: currentMonth })).toBeInTheDocument();
        expect(queryByRole('button', { name: currentDate })).toBeInTheDocument();
    });

    it('should open month passed by value', () => {
        const { queryByRole } = render(<Calendar value={defaultValue} />);

        expect(queryByRole('button', { name: defaultYear })).toBeInTheDocument();
        expect(queryByRole('button', { name: defaultMonth })).toBeInTheDocument();
        expect(queryByRole('button', { name: defaultDateOfMonth })).toBeInTheDocument();
    });

    describe('when minDate is set', () => {
        it('should disable all days before minDate', () => {
            const prevMonthMinDate = subDays(defaultDate, 30).getTime();

            const { container, getByLabelText } = render(
                <Calendar value={defaultValue} minDate={prevMonthMinDate} />,
            );

            expect(container.querySelectorAll('table button:disabled')).toHaveLength(0);

            getByLabelText('Предыдущий месяц').click();

            const nonDisabledDays = container.querySelectorAll('table button:not(:disabled)');

            expect(nonDisabledDays[0]).not.toBeDisabled();
            expect(nonDisabledDays[0]).toHaveTextContent('31');
        });

        it('should hide prev arrow if min date in active month', () => {
            const currentMonthMinDate = subDays(defaultDate, 10).getTime();
            const prevMonthMinDate = subDays(defaultDate, 30).getTime();

            const { queryByLabelText, rerender } = render(
                <Calendar value={defaultValue} minDate={currentMonthMinDate} />,
            );

            const prevMonthButton = () => queryByLabelText('Предыдущий месяц') as HTMLElement;

            expect(prevMonthButton()).not.toBeInTheDocument();

            rerender(<Calendar value={defaultValue} minDate={prevMonthMinDate} />);

            expect(prevMonthButton()).toBeInTheDocument();

            prevMonthButton().click();

            expect(prevMonthButton()).not.toBeInTheDocument();
        });

        it('should disable previous months', () => {
            const prevMonthMinDate = subDays(defaultDate, 40).getTime();

            const { getByRole, container } = render(
                <Calendar value={defaultValue} minDate={prevMonthMinDate} />,
            );

            getByRole('button', { name: 'Ноябрь' }).click();

            const months = container.querySelectorAll('button[data-date]');

            Array.from(months).forEach((monthButton, i) => {
                if (i < MONTHS.indexOf('Октябрь')) {
                    expect(monthButton).toBeDisabled();
                } else {
                    expect(monthButton).not.toBeDisabled();
                }
            });
        });

        it('should not show previous years', () => {
            const prevYearMinDate = subDays(defaultDate, 365).getTime();

            const { getByRole, container } = render(
                <Calendar value={defaultValue} minDate={prevYearMinDate} />,
            );

            getByRole('button', { name: '2020' }).click();

            const years = container.querySelectorAll('button[data-date]');

            expect(years).toHaveLength(2);
            expect(years[0]).toHaveTextContent('2020');
            expect(years[1]).toHaveTextContent('2019');
        });
    });

    describe('when maxDate is set', () => {
        it('should disable all days after maxDate', () => {
            const maxDate = addDays(defaultDate, 10).getTime();
            const { container, getByLabelText } = render(
                <Calendar value={defaultValue} maxDate={maxDate} />,
            );

            expect(container.querySelectorAll('table button:disabled')).toHaveLength(0);

            getByLabelText('Следующий месяц').click();

            const nonDisabledDays = container.querySelectorAll('table button:not(:disabled)');
            const lastNonDisabledDay = nonDisabledDays[nonDisabledDays.length - 1];

            expect(lastNonDisabledDay).not.toBeDisabled();
            expect(lastNonDisabledDay).toHaveTextContent('10');
        });

        it('should hide next arrow if max date in active month', () => {
            const maxDate = addDays(defaultDate, 10).getTime();

            const { queryByLabelText } = render(
                <Calendar value={defaultValue} maxDate={maxDate} />,
            );

            const nextMonthButton = () => queryByLabelText('Следующий месяц') as HTMLElement;

            expect(nextMonthButton()).toBeInTheDocument();

            nextMonthButton().click();

            expect(nextMonthButton()).not.toBeInTheDocument();
        });

        it('should disable next months', () => {
            const nextYearDate = addDays(defaultDate, 32).getTime();

            const { getByRole, getByLabelText, container } = render(
                <Calendar value={defaultValue} maxDate={nextYearDate} />,
            );

            getByRole('button', { name: 'Ноябрь' }).click();

            expect(container.querySelectorAll('button[data-date]:disabled')).toHaveLength(0);

            getByLabelText('Следующий месяц').click();
            getByLabelText('Следующий месяц').click();

            getByRole('button', { name: 'Январь' }).click();

            expect(container.querySelectorAll('button[data-date]:not(:disabled)')).toHaveLength(1);
        });
    });

    describe('when selectedFrom is set', () => {
        it('should highlights days between selectedFrom and hovered date (hovered > selectedFrom)', () => {
            const selectedDay = 15;
            const highlightedDay = 20;

            const selectedFrom = setDate(defaultValue, selectedDay);
            const highlightedDate = setDate(defaultValue, highlightedDay);

            const { container } = render(<Calendar selectedFrom={selectedFrom.getTime()} />);

            const days = container.querySelectorAll('button[data-date]');

            expect(days).toHaveLength(30);

            fireEvent.mouseEnter(days[highlightedDate.getDate() - 1]);

            days.forEach(day => {
                const date = +(day.textContent || '');

                if (date < selectedDay || date > highlightedDay) {
                    expect(day).not.toHaveClass('highlighted');
                    expect(day).not.toHaveClass('range');
                    return;
                }

                if (date === selectedDay) {
                    expect(day).toHaveClass('rangeStart');
                    expect(day).toHaveClass('selected');
                    return;
                }

                if (date === highlightedDay) {
                    expect(day).toHaveClass('highlighted');
                    return;
                }

                expect(day).toHaveClass('range');
            });
        });

        it('should highlights days between hovered and selectedFrom date (hovered < selectedFrom)', () => {
            const selectedDay = 20;
            const highlightedDay = 15;

            const selectedFrom = setDate(defaultValue, selectedDay);
            const highlightedDate = setDate(defaultValue, highlightedDay);

            const { container } = render(<Calendar selectedFrom={selectedFrom.getTime()} />);

            const days = container.querySelectorAll('button[data-date]');

            expect(days).toHaveLength(30);

            fireEvent.mouseEnter(days[highlightedDate.getDate() - 1]);

            days.forEach(day => {
                const date = +(day.textContent || '');

                if (date < highlightedDay || date > selectedDay) {
                    expect(day).not.toHaveClass('highlighted');
                    expect(day).not.toHaveClass('range');
                    return;
                }

                if (date === selectedDay) {
                    expect(day).toHaveClass('selected');
                    return;
                }

                if (date === highlightedDay) {
                    expect(day).toHaveClass('rangeStart');
                    expect(day).toHaveClass('highlighted');
                    return;
                }

                expect(day).toHaveClass('range');
            });
        });
    });

    describe('when only selectedTo is set', () => {
        it('should not highlight anything', () => {
            const selectedDay = 15;
            const highlightedDay = 20;

            const selectedTo = setDate(defaultValue, selectedDay);
            const highlightedDate = setDate(defaultValue, highlightedDay);

            const { container } = render(<Calendar selectedTo={selectedTo.getTime()} />);

            const days = container.querySelectorAll('button[data-date]');

            expect(days).toHaveLength(30);

            fireEvent.mouseEnter(days[highlightedDate.getDate() - 1]);

            days.forEach(day => {
                expect(day).not.toHaveClass('range');
                expect(day).not.toHaveClass('rangeStart');
            });
        });
    });

    describe('when selectedFrom and selectedTo are set', () => {
        it('should highlight days between selectedFrom and selectedTo', () => {
            const fromDay = 15;
            const toDay = 20;
            const highlightedDay = 17;

            const selectedFrom = setDate(defaultValue, fromDay);
            const selectedTo = setDate(defaultValue, toDay);

            const { container } = render(
                <Calendar
                    selectedTo={selectedTo.getTime()}
                    selectedFrom={selectedFrom.getTime()}
                />,
            );

            const days = container.querySelectorAll('button[data-date]');

            expect(days).toHaveLength(30);

            fireEvent.mouseEnter(days[highlightedDay - 1]);

            days.forEach(day => {
                const date = +(day.textContent || '');

                if (date < fromDay || date > toDay) {
                    expect(day).not.toHaveClass('highlighted');
                    expect(day).not.toHaveClass('range');
                    return;
                }

                if (date === fromDay) {
                    expect(day).toHaveClass('rangeStart');
                    return;
                }

                if (date === toDay) {
                    expect(day).toHaveClass('selected');
                    return;
                }

                if (date === highlightedDay) {
                    expect(day).toHaveClass('highlighted');
                }

                expect(day).toHaveClass('range');
            });
        });
    });

    describe('when selectedFrom and selectedTo are in different months', () => {
        it('should set transitRight class to last day of selectedFrom month', () => {
            const selectedFrom = setDate(defaultValue, 20);
            const selectedTo = addDays(defaultValue, 10);

            const { container } = render(
                <Calendar
                    selectedTo={selectedTo.getTime()}
                    selectedFrom={selectedFrom.getTime()}
                />,
            );

            const days = container.querySelectorAll('button[data-date]');

            expect(days[days.length - 1]).toHaveClass('transitRight');
        });

        it('should set transitLeft class to first day of selectedTo month', () => {
            const selectedFrom = setDate(defaultValue, 20);
            const selectedTo = addDays(defaultValue, 10);

            const { container, getByLabelText } = render(
                <Calendar
                    selectedTo={selectedTo.getTime()}
                    selectedFrom={selectedFrom.getTime()}
                />,
            );

            getByLabelText('Следующий месяц').click();

            const days = container.querySelectorAll('button[data-date]');

            expect(days[0]).toHaveClass('transitLeft');
        });
    });

    it('should set offDays', () => {
        const offDays = [
            setDate(defaultDate, 10),
            setDate(defaultDate, 1),
            setDate(defaultDate, 22),
        ];

        const { queryByText } = render(<Calendar value={defaultValue} offDays={offDays} />);

        offDays.forEach(day => {
            const dayOfMonth = day.getDate().toString();
            expect(queryByText(dayOfMonth)?.parentNode).toBeDisabled();
        });
    });

    it('should set events', () => {
        const events = [
            setDate(defaultDate, 10),
            setDate(defaultDate, 1),
            setDate(defaultDate, 22),
        ];

        const { queryByText } = render(<Calendar value={defaultValue} events={events} />);

        events.forEach(day => {
            const dayOfMonth = day.getDate().toString();
            expect(queryByText(dayOfMonth)?.parentNode).toHaveClass('event');
        });
    });

    describe('Callback tests', () => {
        it('should call onChange callback', () => {
            const cb = jest.fn();
            const { getByText } = render(<Calendar onChange={cb} />);

            getByText('10').click();

            expect(cb).toBeCalledTimes(1);
        });

        it('should call onMonthChange callback', () => {
            const cb = jest.fn();
            const { getByLabelText, getByRole } = render(<Calendar onMonthChange={cb} />);

            // 1
            getByLabelText('Следующий месяц').click();
            // 2
            getByLabelText('Предыдущий месяц').click();

            // 3
            getByRole('button', { name: 'Ноябрь' }).click();
            act(() => {
                getByRole('button', { name: 'Октябрь' }).click();
            });

            // 4
            getByRole('button', { name: '2020' }).click();
            act(() => {
                getByRole('button', { name: '2019' }).click();
            });

            expect(cb).toBeCalledTimes(4);
        });
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<Calendar />);

            expect(unmount).not.toThrowError();
        });
    });
});
