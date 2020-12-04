import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { subDays, addDays, setDate, endOfMonth, setMonth, addMonths } from 'date-fns';
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

    const waitForMonthChange = async () => new Promise(res => setTimeout(res, 1000));

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
        const { queryByText } = render(<Calendar />);

        const now = new Date();
        const currentDate = now.getDate().toString();
        const currentMonth = monthName(now).toString();
        const currentYear = now.getFullYear().toString();

        expect(queryByText(currentYear)).toBeInTheDocument();
        expect(queryByText(currentMonth)).toBeInTheDocument();
        expect(queryByText(currentDate)).toBeInTheDocument();
    });

    it('should open month passed by defaultMonth', () => {
        const { queryByText } = render(<Calendar defaultMonth={defaultDate.getTime()} />);

        expect(queryByText(defaultYear)).toBeInTheDocument();
        expect(queryByText(defaultMonth)).toBeInTheDocument();
        expect(queryByText(defaultDateOfMonth)).toBeInTheDocument();
    });

    it('should open month of date passed by value', () => {
        const { queryByText } = render(<Calendar value={defaultValue} />);

        expect(queryByText(defaultYear)).toBeInTheDocument();
        expect(queryByText(defaultMonth)).toBeInTheDocument();
        expect(queryByText(defaultDateOfMonth)).toBeInTheDocument();
    });

    it('should open month passed by month', () => {
        const { queryByText, rerender } = render(<Calendar month={defaultValue} />);

        expect(queryByText(defaultYear)).toBeInTheDocument();
        expect(queryByText(defaultMonth)).toBeInTheDocument();
        expect(queryByText(defaultDateOfMonth)).toBeInTheDocument();

        rerender(<Calendar month={addMonths(defaultValue, 1).getTime()} />);

        expect(queryByText(MONTHS[defaultDate.getMonth() + 1])).toBeInTheDocument();
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

            const { getByText, container } = render(
                <Calendar value={defaultValue} minDate={prevMonthMinDate} />,
            );

            getByText('Ноябрь').click();

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

            const { getByText, container } = render(
                <Calendar value={defaultValue} minDate={prevYearMinDate} />,
            );

            getByText('2020').click();

            const years = container.querySelectorAll('button[data-date]');

            expect(years).toHaveLength(2);
            expect(years[0]).toHaveTextContent('2020');
            expect(years[1]).toHaveTextContent('2019');
        });
    });

    describe('when maxDate is set', () => {
        it('should disable all days after maxDate', async () => {
            const maxDate = addDays(defaultDate, 10).getTime();
            const { container, getByLabelText } = render(
                <Calendar value={defaultValue} maxDate={maxDate} />,
            );

            expect(container.querySelectorAll('table button:disabled')).toHaveLength(0);

            getByLabelText('Следующий месяц').click();

            await waitForMonthChange();

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

            const { getByText, getByLabelText, container } = render(
                <Calendar value={defaultValue} maxDate={nextYearDate} />,
            );

            getByText('Ноябрь').click();

            expect(container.querySelectorAll('button[data-date]:disabled')).toHaveLength(0);

            getByLabelText('Следующий месяц').click();
            getByLabelText('Следующий месяц').click();

            getByText('Январь').click();

            expect(container.querySelectorAll('button[data-date]:not(:disabled)')).toHaveLength(1);
        });
    });

    describe('when selectedFrom is set', () => {
        it('should highlights days between selectedFrom and hovered date (hovered > selectedFrom)', () => {
            const selectedDay = 15;
            const highlightedDay = 20;

            const selectedFrom = setDate(defaultValue, selectedDay);
            const highlightedDate = setDate(defaultValue, highlightedDay);

            const { container } = render(
                <Calendar defaultMonth={defaultValue} selectedFrom={selectedFrom.getTime()} />,
            );

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

            const { container } = render(
                <Calendar defaultMonth={defaultValue} selectedFrom={selectedFrom.getTime()} />,
            );

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

            const { container } = render(
                <Calendar defaultMonth={defaultValue} selectedTo={selectedTo.getTime()} />,
            );

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
                    defaultMonth={defaultValue}
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
                    defaultMonth={defaultValue}
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
                    defaultMonth={defaultValue}
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
            const { getByLabelText, getByText } = render(
                <Calendar defaultMonth={defaultDate.getTime()} onMonthChange={cb} />,
            );

            // 1
            getByLabelText('Следующий месяц').click();
            // 2
            getByLabelText('Предыдущий месяц').click();

            // 3
            getByText('Ноябрь').click();
            act(() => {
                getByText('Октябрь').click();
            });

            // 4
            getByText('2020').click();
            act(() => {
                getByText('2019').click();
            });

            expect(cb).toBeCalledTimes(4);
        });
    });

    describe('Keyboard control', () => {
        const keyCodes = {
            PageUp: 33,
            PageDown: 34,
            End: 35,
            Home: 36,
            ArrowLeft: 37,
            ArrowUp: 38,
            ArrowRight: 39,
            ArrowDown: 40,
        };

        const keyDown = (element: Element, key: string) => {
            fireEvent.keyDown(element, {
                key,
                keyCode: keyCodes[key as keyof typeof keyCodes],
            });
        };

        const getActiveElement = () => document.activeElement as Element;

        describe('when tab pressed', () => {
            it('should focus first focusable button', () => {
                const { container } = render(<Calendar />);

                act(userEvent.tab);

                const activeElement = getActiveElement();

                expect(activeElement).toBeTruthy();
                expect(container.contains(activeElement)).toBeTruthy();
                expect(activeElement.tagName).toBe('BUTTON');
            });
        });

        describe('DaysTable', () => {
            it.each(Object.keys(keyCodes))(
                '%s should focus first non-disabled day of month if there is not focused day',
                key => {
                    const { container } = render(
                        <Calendar
                            defaultMonth={defaultDate.getTime()}
                            offDays={[setDate(defaultDate, 1).getTime()]}
                        />,
                    );

                    act(userEvent.tab);

                    const dayTable = container.querySelector('table') as Element;

                    expect(dayTable.contains(getActiveElement())).toBeFalsy();

                    keyDown(getActiveElement(), key);

                    expect(dayTable.contains(getActiveElement())).toBeTruthy();

                    expect(getActiveElement().textContent).toBe('2');
                },
            );

            it.each(Object.keys(keyCodes))(
                '%s should focus selected day if there is not focused day',
                key => {
                    render(<Calendar value={defaultDate.getTime()} />);

                    act(userEvent.tab);

                    keyDown(getActiveElement(), key);

                    expect(getActiveElement().textContent).toBe(defaultDateOfMonth);
                },
            );

            describe('ArrowLeft', () => {
                it('should move focus to prev day', () => {
                    const prevDayOfMonth = (+defaultDateOfMonth - 1).toString();

                    render(<Calendar value={defaultValue} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowLeft');
                        keyDown(getActiveElement(), 'ArrowLeft');
                    });

                    expect(getActiveElement().textContent).toBe(prevDayOfMonth);
                });

                it('should move focus to prev day in another month', async () => {
                    const firstDateOfMonth = setDate(defaultValue, 1);
                    const lastDateOfPrevMonth = subDays(firstDateOfMonth, 1);

                    const { getByText } = render(<Calendar value={firstDateOfMonth.getTime()} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowLeft');
                        keyDown(getActiveElement(), 'ArrowLeft');
                    });

                    await waitForMonthChange();

                    expect(firstDateOfMonth.getDate().toString()).toBe('1');

                    expect(lastDateOfPrevMonth.getDate().toString()).toBe('31');

                    expect(getActiveElement().tagName).toBe('BUTTON');

                    expect(getByText('Октябрь')).toBeInTheDocument();

                    expect(getActiveElement().textContent).toBe(
                        lastDateOfPrevMonth.getDate().toString(),
                    );
                });

                it('should jump over disabled days', async () => {
                    const firstDateOfMonth = setDate(defaultValue, 1);
                    const lastDateOfPrevMonth = subDays(firstDateOfMonth, 1);
                    const selectedDate = addDays(firstDateOfMonth, 2);
                    const targetDate = subDays(lastDateOfPrevMonth, 1);

                    render(
                        <Calendar
                            value={selectedDate.getTime()}
                            offDays={[
                                lastDateOfPrevMonth,
                                firstDateOfMonth,
                                addDays(firstDateOfMonth, 1),
                            ]}
                        />,
                    );

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowLeft');
                        keyDown(getActiveElement(), 'ArrowLeft');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });
            });

            describe('ArrowRight', () => {
                it('should move focus to next day', async () => {
                    const nextDateOfMonth = addDays(defaultDate, 1);

                    render(<Calendar value={defaultValue} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowRight');
                        keyDown(getActiveElement(), 'ArrowRight');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().textContent).toBe(
                        nextDateOfMonth.getDate().toString(),
                    );
                });

                it('should move focus to next day in another month', async () => {
                    const lastDateOfMonth = endOfMonth(defaultValue);
                    const firstDateOfNextMonth = addDays(lastDateOfMonth, 1);

                    const { getByText } = render(<Calendar value={lastDateOfMonth.getTime()} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowRight');
                        keyDown(getActiveElement(), 'ArrowRight');
                    });

                    await waitForMonthChange();

                    expect(lastDateOfMonth.getDate().toString()).toBe('30');

                    expect(firstDateOfNextMonth.getDate().toString()).toBe('1');

                    expect(getActiveElement().tagName).toBe('BUTTON');

                    expect(getByText('Декабрь')).toBeInTheDocument();

                    expect(getActiveElement().textContent).toBe(
                        firstDateOfNextMonth.getDate().toString(),
                    );
                });

                it('should jump over disabled days', async () => {
                    const lastDateOfMonth = endOfMonth(defaultValue);
                    const selectedDate = subDays(lastDateOfMonth, 1);
                    const firstDateOfNextMonth = addDays(lastDateOfMonth, 1);
                    const targetDate = addDays(firstDateOfNextMonth, 2);

                    render(
                        <Calendar
                            value={selectedDate.getTime()}
                            offDays={[
                                lastDateOfMonth,
                                firstDateOfNextMonth,
                                addDays(firstDateOfNextMonth, 1),
                            ]}
                        />,
                    );

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowRight');
                        keyDown(getActiveElement(), 'ArrowRight');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });
            });

            describe('ArrowUp', () => {
                it('should move focus to prev week', () => {
                    const prevWeekDate = subDays(defaultValue, 7)
                        .getDate()
                        .toString();

                    render(<Calendar value={defaultValue} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowUp');
                        keyDown(getActiveElement(), 'ArrowUp');
                    });

                    expect(getActiveElement().textContent).toBe(prevWeekDate);
                });

                it('should move focus to prev week in another month', async () => {
                    const firstDateOfMonth = setDate(defaultValue, 1);
                    const targetDate = subDays(firstDateOfMonth, 7);

                    const { getByText } = render(<Calendar value={firstDateOfMonth.getTime()} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowUp');
                        keyDown(getActiveElement(), 'ArrowUp');
                    });

                    await waitForMonthChange();

                    expect(firstDateOfMonth.getDate().toString()).toBe('1');

                    expect(targetDate.getDate().toString()).toBe('25');

                    expect(getActiveElement().tagName).toBe('BUTTON');

                    expect(getByText('Октябрь')).toBeInTheDocument();

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });

                it('should jump over disabled days', () => {
                    const targetDate = subDays(defaultValue, 8);

                    render(<Calendar value={defaultValue} offDays={[subDays(defaultValue, 7)]} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowUp');
                        keyDown(getActiveElement(), 'ArrowUp');
                    });

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });
            });

            describe('ArrowDown', () => {
                it('should move focus to next week', async () => {
                    const nextWeekDate = addDays(defaultValue, 7)
                        .getDate()
                        .toString();

                    render(<Calendar value={defaultValue} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowDown');
                        keyDown(getActiveElement(), 'ArrowDown');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().textContent).toBe(nextWeekDate);
                });

                it('should move focus to next week in another month', async () => {
                    const lastDateOfMonth = endOfMonth(defaultValue);
                    const targetDate = addDays(lastDateOfMonth, 7);

                    const { getByText } = render(<Calendar value={lastDateOfMonth.getTime()} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowDown');
                        keyDown(getActiveElement(), 'ArrowDown');
                    });

                    await waitForMonthChange();

                    expect(lastDateOfMonth.getDate().toString()).toBe('30');

                    expect(targetDate.getDate().toString()).toBe('7');

                    expect(getActiveElement().tagName).toBe('BUTTON');

                    expect(getByText('Декабрь')).toBeInTheDocument();

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });

                it('should jump over disabled days', async () => {
                    const targetDate = addDays(defaultValue, 8);

                    render(<Calendar value={defaultValue} offDays={[addDays(defaultValue, 7)]} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'ArrowDown');
                        keyDown(getActiveElement(), 'ArrowDown');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });
            });

            describe('End', () => {
                it('should move focus to end of week', async () => {
                    const targetDate = addDays(defaultValue, 6);

                    const { getByText } = render(<Calendar value={defaultValue} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'End');
                        keyDown(getActiveElement(), 'End');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().tagName).toBe('BUTTON');
                    expect(getByText('Декабрь')).toBeInTheDocument();
                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });

                it('should focus last non disabled day of week', async () => {
                    const targetDate = addDays(defaultValue, 5);

                    render(<Calendar value={defaultValue} offDays={[addDays(defaultValue, 6)]} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'End');
                        keyDown(getActiveElement(), 'End');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });
            });

            describe('Home', () => {
                it('should move focus to start of week', async () => {
                    const value = setDate(defaultValue, 1);
                    const targetDate = subDays(value, 6);

                    const { getByText } = render(<Calendar value={value.getTime()} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'Home');
                        keyDown(getActiveElement(), 'Home');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().tagName).toBe('BUTTON');
                    expect(getByText('Октябрь')).toBeInTheDocument();
                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });

                it('should focus first non disabled day of week', async () => {
                    const value = setDate(defaultValue, 1);
                    const targetDate = subDays(value, 6);

                    render(<Calendar value={value.getTime()} offDays={[subDays(value, 7)]} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'Home');
                        keyDown(getActiveElement(), 'Home');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });
            });

            describe('PageUp', () => {
                it('should move focus to prev month', async () => {
                    const targetDate = setMonth(defaultValue, defaultDate.getMonth() - 1);

                    const { getByText } = render(<Calendar value={defaultValue} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'PageUp');
                        keyDown(getActiveElement(), 'PageUp');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().tagName).toBe('BUTTON');
                    expect(getByText('Октябрь')).toBeInTheDocument();
                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });

                it('should jump over disabled days', async () => {
                    const prevMonthDate = setMonth(defaultValue, defaultDate.getMonth() - 1);
                    const targetDate = subDays(prevMonthDate, 1);

                    render(<Calendar value={defaultValue} offDays={[prevMonthDate]} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'PageUp');
                        keyDown(getActiveElement(), 'PageUp');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });
            });

            describe('PageDown', () => {
                it('should move focus to next month', async () => {
                    const targetDate = setMonth(defaultValue, defaultDate.getMonth() + 1);

                    const { getByText } = render(<Calendar value={defaultValue} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'PageDown');
                        keyDown(getActiveElement(), 'PageDown');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().tagName).toBe('BUTTON');
                    expect(getByText('Декабрь')).toBeInTheDocument();
                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });

                it('should jump over disabled days', async () => {
                    const prevMonthDate = setMonth(defaultValue, defaultDate.getMonth() + 1);
                    const targetDate = addDays(prevMonthDate, 1);

                    render(<Calendar value={defaultValue} offDays={[prevMonthDate]} />);

                    act(() => {
                        userEvent.tab();
                        keyDown(getActiveElement(), 'PageDown');
                        keyDown(getActiveElement(), 'PageDown');
                    });

                    await waitForMonthChange();

                    expect(getActiveElement().textContent).toBe(targetDate.getDate().toString());
                });
            });
        });

        describe('MonthsTable', () => {
            it.each(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'])(
                '%s should focus selected or current month if there is not focused month',
                key => {
                    const { getByText, container } = render(
                        <Calendar defaultMonth={defaultDate.getTime()} />,
                    );

                    getByText(defaultMonth).click();

                    act(userEvent.tab);

                    const monthsTable = container.querySelector('.monthsTable') as Element;

                    expect(monthsTable.contains(getActiveElement())).toBeFalsy();

                    keyDown(getActiveElement(), key);

                    expect(monthsTable.contains(getActiveElement())).toBeTruthy();

                    expect(getActiveElement().textContent).toBe('Ноябрь');
                },
            );

            describe('ArrowLeft', () => {
                it('should focus prev month', () => {
                    const { getByText } = render(<Calendar defaultMonth={defaultDate.getTime()} />);

                    getByText(defaultMonth).click();

                    act(userEvent.tab);

                    keyDown(getActiveElement(), 'ArrowLeft');

                    ['Октябрь', 'Сентябрь'].forEach(month => {
                        keyDown(getActiveElement(), 'ArrowLeft');
                        expect(getActiveElement().textContent).toBe(month);
                    });
                });
            });

            describe('ArrowRight', () => {
                it('should focus next month', () => {
                    const { getByText } = render(<Calendar defaultMonth={defaultDate.getTime()} />);

                    getByText(defaultMonth).click();

                    act(userEvent.tab);

                    keyDown(getActiveElement(), 'ArrowRight');

                    ['Декабрь', 'Декабрь'].forEach(month => {
                        keyDown(getActiveElement(), 'ArrowRight');
                        expect(getActiveElement().textContent).toBe(month);
                    });
                });
            });

            describe('ArrowUp', () => {
                it('should focus n - 3 month', () => {
                    const { getByText } = render(<Calendar defaultMonth={defaultDate.getTime()} />);

                    getByText(defaultMonth).click();

                    act(userEvent.tab);

                    keyDown(getActiveElement(), 'ArrowUp');

                    ['Август', 'Май', 'Февраль', 'Февраль'].forEach(month => {
                        keyDown(getActiveElement(), 'ArrowUp');
                        expect(getActiveElement().textContent).toBe(month);
                    });
                });
            });

            describe('ArrowDown', () => {
                it('should focus n + 3 month', () => {
                    const { getByText } = render(
                        <Calendar defaultMonth={setMonth(defaultDate, 0).getTime()} />,
                    );

                    getByText('Январь').click();

                    act(userEvent.tab);

                    keyDown(getActiveElement(), 'ArrowDown');

                    ['Апрель', 'Июль', 'Октябрь', 'Октябрь'].forEach(month => {
                        keyDown(getActiveElement(), 'ArrowDown');
                        expect(getActiveElement().textContent).toBe(month);
                    });
                });
            });
        });

        describe('YearsTable', () => {
            it.each(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'])(
                '%s should focus selected or current year if there is not focused year',
                key => {
                    const { getByText, container } = render(
                        <Calendar defaultMonth={defaultDate.getTime()} />,
                    );

                    getByText(defaultYear).click();

                    act(userEvent.tab);

                    const yearsTable = container.querySelector('.yearsTable') as Element;

                    expect(yearsTable.contains(getActiveElement())).toBeFalsy();

                    keyDown(getActiveElement(), key);

                    expect(yearsTable.contains(getActiveElement())).toBeTruthy();

                    expect(getActiveElement().textContent).toBe('2020');
                },
            );

            describe('ArrowRight', () => {
                it('should focus prev year', () => {
                    const { getByText } = render(<Calendar defaultMonth={defaultDate.getTime()} />);

                    getByText(defaultYear).click();

                    act(userEvent.tab);

                    keyDown(getActiveElement(), 'ArrowRight');

                    ['2019', '2018', '2017'].forEach(year => {
                        keyDown(getActiveElement(), 'ArrowRight');
                        expect(getActiveElement().textContent).toBe(year);
                    });
                });
            });

            describe('ArrowLeft', () => {
                it('should focus next year', () => {
                    const { getByText } = render(<Calendar defaultMonth={defaultDate.getTime()} />);

                    getByText(defaultYear).click();

                    act(userEvent.tab);

                    keyDown(getActiveElement(), 'ArrowRight');
                    keyDown(getActiveElement(), 'ArrowRight');
                    keyDown(getActiveElement(), 'ArrowRight');

                    ['2019', '2020'].forEach(year => {
                        keyDown(getActiveElement(), 'ArrowLeft');
                        expect(getActiveElement().textContent).toBe(year);
                    });
                });
            });

            describe('ArrowUp', () => {
                it('should focus n + 3 year', () => {
                    const { getByText } = render(<Calendar defaultMonth={defaultDate.getTime()} />);

                    getByText(defaultYear).click();

                    act(userEvent.tab);

                    keyDown(getActiveElement(), 'ArrowUp');
                    keyDown(getActiveElement(), 'ArrowDown');
                    keyDown(getActiveElement(), 'ArrowDown');

                    ['2017', '2020'].forEach(year => {
                        keyDown(getActiveElement(), 'ArrowUp');
                        expect(getActiveElement().textContent).toBe(year);
                    });
                });
            });

            describe('ArrowDown', () => {
                it('should focus n - 3 month', () => {
                    const { getByText } = render(<Calendar defaultMonth={defaultDate.getTime()} />);

                    getByText(defaultYear).click();

                    act(userEvent.tab);

                    keyDown(getActiveElement(), 'ArrowDown');

                    ['2017', '2014'].forEach(year => {
                        keyDown(getActiveElement(), 'ArrowDown');
                        expect(getActiveElement().textContent).toBe(year);
                    });
                });
            });
        });
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<Calendar />);

            expect(unmount).not.toThrowError();
        });
    });
});
