import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { CalendarInput } from './index';

describe('CalendarInput', () => {
    const getSelectedDay = () =>
        document.querySelector('button[aria-selected="true"]') as HTMLButtonElement;

    describe('Display tests', () => {
        it('should match snapshot', () => {
            expect(render(<CalendarInput />).container).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` attribute', () => {
        const testId = 'test-id';
        const { getByTestId } = render(<CalendarInput dataTestId={testId} />);

        expect(getByTestId(testId)).toBeInTheDocument();
    });

    it('should set custom class', () => {
        const className = 'custom-class';
        const { container } = render(<CalendarInput className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should render calendar under the input field when calendarPosition=static', async () => {
        const { container } = render(
            <CalendarInput calendarProps={{ className: 'calendar' }} calendarPosition='static' />,
        );

        await waitFor(() => {
            expect(container.querySelector('.calendar')).toBeInTheDocument();
        });
    });

    it('should open calendar when defaultOpen=true', async () => {
        render(<CalendarInput calendarProps={{ className: 'calendar' }} defaultOpen={true} />);

        await waitFor(() => {
            expect(document.querySelector('.calendar')).toBeInTheDocument();
        });
    });

    it('should render input[type=date] if mobileMode=native', async () => {
        const { queryByRole } = render(<CalendarInput mobileMode='native' />);

        expect(queryByRole('textbox')).toBeInTheDocument();
    });

    describe('Open/Close behavior', () => {
        it('should open calendar on click', async () => {
            const { container } = render(
                <CalendarInput calendarProps={{ className: 'calendar' }} />,
            );
            const component = container.firstElementChild as HTMLDivElement;

            await waitFor(() => {
                fireEvent.click(component);
                expect(document.querySelector('.calendar')).toBeInTheDocument();
            });
        });

        it('should open calendar on focus', async () => {
            const { container } = render(
                <CalendarInput calendarProps={{ className: 'calendar' }} />,
            );
            const component = container.firstElementChild as HTMLDivElement;

            await waitFor(() => {
                fireEvent.focus(component);
                expect(document.querySelector('.calendar')).toBeInTheDocument();
            });
        });

        it('should close calendar on blur', async () => {
            const { container } = render(
                <CalendarInput calendarProps={{ className: 'calendar' }} />,
            );
            const component = container.firstElementChild as HTMLDivElement;

            await waitFor(() => {
                fireEvent.focus(component);
                expect(document.querySelector('.calendar')).toBeInTheDocument();
            });

            await waitFor(() => {
                fireEvent.blur(component);
                expect(document.querySelector('.calendar')).not.toBeInTheDocument();
            });
        });

        it('should close calendar on escape', async () => {
            const { container } = render(
                <CalendarInput calendarProps={{ className: 'calendar' }} />,
            );
            const component = container.firstElementChild as HTMLDivElement;

            await waitFor(() => {
                fireEvent.focus(component);
                expect(document.querySelector('.calendar')).toBeInTheDocument();
            });

            fireEvent.keyDown(component, { key: 'Escape' });

            await waitFor(() => {
                expect(document.querySelector('.calendar')).not.toBeInTheDocument();
            });
        });

        it('should toggle calendar on enter if input focused', async () => {
            const { container, queryByRole } = render(
                <CalendarInput calendarProps={{ className: 'calendar' }} />,
            );
            const component = container.firstElementChild as HTMLDivElement;
            const input = queryByRole('textbox') as HTMLInputElement;

            await waitFor(() => {
                fireEvent.focus(component);
                expect(document.querySelector('.calendar')).toBeInTheDocument();
            });

            fireEvent.keyDown(component, { key: 'Enter' });

            await waitFor(() => {
                expect(document.querySelector('.calendar')).toBeInTheDocument();
            });

            fireEvent.keyDown(input, { key: 'Enter' });

            await waitFor(() => {
                expect(document.querySelector('.calendar')).not.toBeInTheDocument();
            });

            fireEvent.keyDown(input, { key: 'Enter' });

            await waitFor(() => {
                expect(document.querySelector('.calendar')).toBeInTheDocument();
            });
        });
    });

    describe('Controlled-way', () => {
        it('should set value to input', () => {
            const value = '01.01.2020';
            const value2 = '02.01.2020';
            const { queryByRole, rerender } = render(<CalendarInput value={value} />);

            expect(queryByRole('textbox')).toHaveValue(value);

            rerender(<CalendarInput value={value2} />);

            expect(queryByRole('textbox')).toHaveValue(value2);
        });

        it('should set value to calendar', async () => {
            const value = '01.01.2020';
            const value2 = '02.01.2020';
            const { container, rerender } = render(<CalendarInput value={value} />);

            const component = container.firstElementChild as HTMLDivElement;

            await waitFor(() => {
                fireEvent.click(component);
            });

            const selectedButton = getSelectedDay();

            expect(selectedButton).toBeInTheDocument();

            const date = new Date(+(selectedButton.getAttribute('data-date') as string));

            expect(date.getMonth()).toBe(0);
            expect(date.getFullYear()).toBe(2020);
            expect(date.getDate()).toBe(1);

            await waitFor(() => {
                rerender(<CalendarInput value={value2} />);
            });

            expect(document.querySelector('button[aria-selected="true"]')).toHaveTextContent('2');
        });

        it('should not change calendar if passed invalid value', async () => {
            const value = '20.20.2020';
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const { container, queryByText, rerender } = render(
                <CalendarInput
                    calendarPosition='static'
                    defaultMonth={defaultMonth}
                    value={value}
                />,
            );

            expect(queryByText('Ноябрь')).toBeInTheDocument();
            expect(container.querySelector('button[aria-selected="true"]')).not.toBeInTheDocument();

            rerender(
                <CalendarInput
                    calendarPosition='static'
                    defaultMonth={defaultMonth}
                    value='21.21.2121'
                />,
            );

            expect(queryByText('Ноябрь')).toBeInTheDocument();
            expect(container.querySelector('button[aria-selected="true"]')).not.toBeInTheDocument();
        });
    });

    describe('Uncontrolled-way', () => {
        it('should set default month', () => {
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const { queryByText } = render(
                <CalendarInput calendarPosition='static' defaultMonth={defaultMonth} />,
            );

            expect(queryByText('Ноябрь')).toBeInTheDocument();
        });

        it('should set default value to input', () => {
            const value = '01.01.2020';
            const { queryByRole } = render(<CalendarInput defaultValue={value} />);

            expect(queryByRole('textbox')).toHaveValue(value);
        });

        it('should set default value to calendar', async () => {
            const value = '01.01.2020';
            const { container } = render(<CalendarInput defaultValue={value} />);

            const component = container.firstElementChild as HTMLDivElement;

            await waitFor(() => {
                fireEvent.click(component);
            });

            const selectedButton = getSelectedDay();

            expect(selectedButton).toBeInTheDocument();

            const date = new Date(+(selectedButton.getAttribute('data-date') as string));

            expect(date.getMonth()).toBe(0);
            expect(date.getFullYear()).toBe(2020);
            expect(date.getDate()).toBe(1);
        });

        it('should set value to input and calendar', async () => {
            const value = '01.01.2020';
            const { queryByRole, container } = render(<CalendarInput />);
            const component = container.firstElementChild as HTMLDivElement;

            await waitFor(() => {
                fireEvent.click(component);
            });

            const input = queryByRole('textbox') as HTMLInputElement;

            userEvent.type(input, value);

            await waitFor(() => {
                expect(input).toHaveValue(value);
            });

            const selectedButton = getSelectedDay();

            expect(selectedButton).toBeInTheDocument();

            const date = new Date(+(selectedButton.getAttribute('data-date') as string));

            expect(date.getMonth()).toBe(0);
            expect(date.getFullYear()).toBe(2020);
            expect(date.getDate()).toBe(1);
        });

        it('should not change calendar if entered invalid value', async () => {
            const value = '20.20.2020';
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const { container, queryByText, queryByRole } = render(
                <CalendarInput calendarPosition='static' defaultMonth={defaultMonth} />,
            );

            const input = queryByRole('textbox') as HTMLInputElement;

            expect(queryByText('Ноябрь')).toBeInTheDocument();
            expect(container.querySelector('button[aria-selected="true"]')).not.toBeInTheDocument();

            userEvent.type(input, value);
            await waitFor(() => expect(input).toHaveValue(value));

            expect(queryByText('Ноябрь')).toBeInTheDocument();
            expect(container.querySelector('button[aria-selected="true"]')).not.toBeInTheDocument();
        });
    });

    describe('Min/Max', () => {
        it('should set min and max dates to calendar', () => {
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const minDate = new Date('November 10, 2020 00:00:00').getTime();
            const maxDate = new Date('November 25, 2020 00:00:00').getTime();
            const { container } = render(
                <CalendarInput
                    calendarPosition='static'
                    minDate={minDate}
                    maxDate={maxDate}
                    defaultMonth={defaultMonth}
                />,
            );

            const nonDisabledDays = container.querySelectorAll('button[data-date]:not(:disabled)');

            expect(nonDisabledDays).toHaveLength(16);
            expect(nonDisabledDays[0]).toHaveTextContent('10');
            expect(nonDisabledDays[nonDisabledDays.length - 1]).toHaveTextContent('25');
        });

        it('should set calendar value if value in [minDate, maxDate]', () => {
            const value = '01.12.2020';
            const minDate = new Date('November 10, 2020 00:00:00').getTime();
            const maxDate = new Date('November 25, 2020 00:00:00').getTime();
            const { container } = render(
                <CalendarInput
                    calendarPosition='static'
                    value={value}
                    minDate={minDate}
                    maxDate={maxDate}
                />,
            );

            expect(container.querySelector('button[aria-selected="true"]')).not.toBeInTheDocument();
        });

        it('should not change calendar month if passed value not in [minDate, maxDate]', () => {
            const value = '01.11.2020';
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const minDate = new Date('November 10, 2020 00:00:00').getTime();
            const maxDate = new Date('November 25, 2020 00:00:00').getTime();
            const { queryByText, rerender } = render(
                <CalendarInput
                    calendarPosition='static'
                    defaultMonth={defaultMonth}
                    value={value}
                    minDate={minDate}
                    maxDate={maxDate}
                />,
            );

            expect(queryByText('Ноябрь')).toBeInTheDocument();

            rerender(
                <CalendarInput
                    calendarPosition='static'
                    defaultMonth={defaultMonth}
                    value='01.10.2020'
                    minDate={minDate}
                    maxDate={maxDate}
                />,
            );

            expect(queryByText('Октябрь')).not.toBeInTheDocument();
            expect(queryByText('Ноябрь')).toBeInTheDocument();
        });

        it('should not change calendar month if entered value not in [minDate, maxDate]', async () => {
            const value = '01.11.2020';
            const value2 = '01.10.2020';
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const minDate = new Date('November 10, 2020 00:00:00').getTime();
            const maxDate = new Date('November 25, 2020 00:00:00').getTime();
            const { queryByRole, queryByText } = render(
                <CalendarInput
                    calendarPosition='static'
                    defaultMonth={defaultMonth}
                    minDate={minDate}
                    maxDate={maxDate}
                />,
            );

            const input = queryByRole('textbox') as HTMLInputElement;

            userEvent.type(input, value);
            await waitFor(() => expect(input).toHaveValue(value));

            expect(queryByText('Ноябрь')).toBeInTheDocument();

            input.setSelectionRange(0, input.value.length);
            await userEvent.type(input, '{backspace}');
            userEvent.type(input, value2);
            await waitFor(() => expect(input).toHaveValue(value2));

            expect(queryByText('Октябрь')).not.toBeInTheDocument();
            expect(queryByText('Ноябрь')).toBeInTheDocument();
        });
    });

    describe('Callback tests', () => {
        it('should call onChange callback', () => {
            const cb = jest.fn();
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const { getByText } = render(
                <CalendarInput
                    calendarPosition='static'
                    defaultMonth={defaultMonth}
                    onChange={cb}
                />,
            );

            getByText('1').click();

            const { date, value } = cb.mock.calls[0][1];

            expect(cb).toBeCalledTimes(1);
            expect(date).toBeTruthy();
            expect((date as Date).getTime()).toBe(defaultMonth);
            expect(value).toBe('01.11.2020');
        });

        it('should call onCalendarChange callback', () => {
            const cb = jest.fn();
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const { getByText } = render(
                <CalendarInput
                    calendarPosition='static'
                    defaultMonth={defaultMonth}
                    onCalendarChange={cb}
                />,
            );

            getByText('1').click();

            const date = cb.mock.calls[0][0];

            expect(cb).toBeCalledTimes(1);
            expect(date).toBeTruthy();
            expect(date).toBe(defaultMonth);
        });

        it('should call onInputChange callback', async () => {
            const cb = jest.fn();
            const value = '01.11.2020';
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const { queryByRole } = render(
                <CalendarInput
                    calendarPosition='static'
                    defaultMonth={defaultMonth}
                    onInputChange={cb}
                />,
            );

            const input = queryByRole('textbox') as HTMLInputElement;

            userEvent.type(input, value);

            await waitFor(() => {
                expect(input).toHaveValue(value);
            });

            const payload = cb.mock.calls[value.length - 1][1];

            expect(cb).toBeCalledTimes(value.length);
            expect(payload.date).toBeTruthy();
            expect(payload.date.getTime()).toBe(defaultMonth);
            expect(payload.value).toBe('01.11.2020');
        });

        it('should not call onChange until the full date is entered', async () => {
            const cb = jest.fn();
            const value = '01.11.2020';
            const defaultMonth = new Date('November 01, 2020 00:00:00').getTime();
            const { queryByRole } = render(
                <CalendarInput
                    calendarPosition='static'
                    defaultMonth={defaultMonth}
                    onChange={cb}
                />,
            );

            const input = queryByRole('textbox') as HTMLInputElement;

            userEvent.type(input, value);

            await waitFor(() => {
                expect(input).toHaveValue(value);
            });

            expect(cb).toBeCalledTimes(1);
        });

        it('should call onChange if empty date is entered', async () => {
            const cb = jest.fn();
            const { queryByRole } = render(
                <CalendarInput calendarPosition='static' defaultValue='1' onChange={cb} />,
            );

            const input = queryByRole('textbox') as HTMLInputElement;

            input.setSelectionRange(0, 2);
            await userEvent.type(input, '{backspace}');

            expect(cb).toBeCalledTimes(1);

            const { date, value } = cb.mock.calls[0][1];

            expect(value).toBe('');
            expect((date as Date).getTime()).toBeNaN();
        });
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<CalendarInput />);

            expect(unmount).not.toThrowError();
        });
    });
});
