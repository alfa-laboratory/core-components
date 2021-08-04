import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/react';

import { DateInput } from './index';

describe('DateInput', () => {
    describe('Display tests', () => {
        it('should match snapshot', () => {
            expect(render(<DateInput value='01.01.2021' />).container).toMatchSnapshot();
        });
    });

    it('should set `data-test-id` attribute', () => {
        const testId = 'test-id';
        const { getByTestId } = render(<DateInput dataTestId={testId} />);

        expect(getByTestId(testId)).toBeInTheDocument();
    });

    it('should set custom class', () => {
        const className = 'custom-class';
        const { container } = render(<DateInput className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should render input[type=date] if mobileMode=native', async () => {
        const { container } = render(<DateInput mobileMode='native' />);

        expect(container.querySelector('input[type="date"]')).toBeInTheDocument();
    });

    describe('Controlled-way', () => {
        it('should set value to input', () => {
            const value = '01.01.2020';
            const value2 = '02.01.2020';
            const { queryByRole, rerender } = render(<DateInput value={value} />);

            expect(queryByRole('textbox')).toHaveValue(value);

            rerender(<DateInput value={value2} />);

            expect(queryByRole('textbox')).toHaveValue(value2);
        });
    });

    describe('Uncontrolled-way', () => {
        it('should set default value to input', () => {
            const value = '01.01.2020';
            const { queryByRole } = render(<DateInput defaultValue={value} />);

            expect(queryByRole('textbox')).toHaveValue(value);
        });

        it('should set value to input', async () => {
            const value = '01.01.2020';
            const { queryByRole } = render(<DateInput />);

            const input = queryByRole('textbox') as HTMLInputElement;

            userEvent.type(input, value);

            await waitFor(() => {
                expect(input).toHaveValue(value);
            });
        });
    });

    describe('Callback tests', () => {
        it('should call onChange callback', () => {
            const cb = jest.fn();
            const value = '01.01.2020';
            const { queryByRole } = render(<DateInput onChange={cb} />);

            const input = queryByRole('textbox') as HTMLInputElement;

            userEvent.type(input, value);

            expect(cb).toBeCalledTimes(value.length);
        });
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<DateInput />);

            expect(unmount).not.toThrowError();
        });
    });
});
