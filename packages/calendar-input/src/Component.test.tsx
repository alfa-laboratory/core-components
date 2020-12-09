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
    });

    describe('Uncontrolled-way', () => {
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
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<CalendarInput />);

            expect(unmount).not.toThrowError();
        });
    });
});
