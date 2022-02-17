import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CodeInput } from '.';

const getInputs = (container: HTMLElement) => container.querySelectorAll('input');

const getInput = (container: HTMLElement, index: number) => getInputs(container)[index];

describe('CodeInput', () => {
    describe('Display tests', () => {
        it('should display correctly', () => {
            const { container } = render(<CodeInput />);

            expect(container).toMatchSnapshot();
        });

        it('should display correctly with error', () => {
            const { container } = render(<CodeInput error='Error' />);

            expect(container).toMatchSnapshot();
        });
    });

    describe('Props tests', () => {
        it('should render 4 fields by default', () => {
            const { container } = render(<CodeInput />);

            const inputs = getInputs(container);

            expect(inputs.length).toBe(4);
        });

        it('should render passed fields count', () => {
            const fields = 5;

            const { container } = render(<CodeInput fields={fields} />);

            const inputs = getInputs(container);

            expect(inputs.length).toBe(fields);
        });

        it('should render initial values', () => {
            const initialValues = '1234';

            const { container } = render(<CodeInput initialValues={initialValues} />);

            const inputs = getInputs(container);

            expect(inputs[0]).toHaveValue(initialValues[0]);
            expect(inputs[1]).toHaveValue(initialValues[1]);
            expect(inputs[2]).toHaveValue(initialValues[2]);
            expect(inputs[3]).toHaveValue(initialValues[3]);
        });

        it('should render disabled inputs', () => {
            const { container } = render(<CodeInput disabled={true} />);

            const inputs = getInputs(container);

            expect(inputs[0]).toBeDisabled();
            expect(inputs[1]).toBeDisabled();
            expect(inputs[2]).toBeDisabled();
            expect(inputs[3]).toBeDisabled();
        });

        it('should render error', () => {
            const errorText = 'Error';

            const { getByRole, getByText } = render(<CodeInput error={errorText} />);

            const errorContainer = getByRole('alert');

            expect(errorContainer).toBeInTheDocument();
            expect(getByText(errorText)).toBeInTheDocument();
        });

        it('should set dataTestId', () => {
            const testId = 'testId';

            const { getByTestId } = render(<CodeInput dataTestId={testId} />);

            expect(getByTestId(testId)).toBeInTheDocument();
        });

        it('should set custom className', () => {
            const className = 'className';
            const testId = 'testId';

            const { getByTestId } = render(<CodeInput className={className} dataTestId={testId} />);

            expect(getByTestId(testId)).toHaveClass(className);
        });
    });

    describe('Interactions tests', () => {
        it('onChange should be called on user typing', async () => {
            const onChange = jest.fn();
            const onComplete = jest.fn();

            const { container } = render(<CodeInput onChange={onChange} onComplete={onComplete} />);

            const input = getInput(container, 0);

            await userEvent.type(input, '1234');

            expect(onChange).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledTimes(4);
            expect(onComplete).toHaveBeenCalled();
            expect(onComplete).toHaveBeenCalledTimes(1);
        });

        it('should be filled correctly', async () => {
            const { container, getByDisplayValue } = render(<CodeInput />);

            const input = getInput(container, 0);

            await userEvent.type(input, '1234');

            expect(getByDisplayValue('1')).toBeInTheDocument();
            expect(getByDisplayValue('2')).toBeInTheDocument();
            expect(getByDisplayValue('3')).toBeInTheDocument();
            expect(getByDisplayValue('4')).toBeInTheDocument();
        });

        it('should be filled correctly in copypast case', async () => {
            const { container, getByDisplayValue } = render(<CodeInput />);

            const input = getInput(container, 0);

            await userEvent.paste(input, '1234');

            expect(getByDisplayValue('1')).toBeInTheDocument();
            expect(getByDisplayValue('2')).toBeInTheDocument();
            expect(getByDisplayValue('3')).toBeInTheDocument();
            expect(getByDisplayValue('4')).toBeInTheDocument();
        });

        it('should be cut code properly in copypast case', async () => {
            const { container, getByDisplayValue } = render(<CodeInput />);

            const input = getInput(container, 0);

            await userEvent.paste(input, '12345');

            expect(getByDisplayValue('1')).toBeInTheDocument();
            expect(getByDisplayValue('2')).toBeInTheDocument();
            expect(getByDisplayValue('3')).toBeInTheDocument();
            expect(getByDisplayValue('4')).toBeInTheDocument();
        });

        it('should filter correctly', () => {
            const { container, getByDisplayValue } = render(<CodeInput />);

            const input = getInput(container, 0);

            userEvent.type(input, '1av2hv3yu4');

            expect(getByDisplayValue('1')).toBeInTheDocument();
            expect(getByDisplayValue('2')).toBeInTheDocument();
            expect(getByDisplayValue('3')).toBeInTheDocument();
            expect(getByDisplayValue('4')).toBeInTheDocument();
        });

        it('should be cleared correctly', async () => {
            const { container, queryByDisplayValue } = render(<CodeInput />);

            await userEvent.type(getInput(container, 0), '4321');
            await userEvent.type(getInput(container, 3), '{backspace}');
            await userEvent.type(getInput(container, 2), '{backspace}');
            await userEvent.type(getInput(container, 1), '{backspace}');
            await userEvent.type(getInput(container, 0), '{backspace}');

            expect(queryByDisplayValue('4')).not.toBeInTheDocument();
            expect(queryByDisplayValue('3')).not.toBeInTheDocument();
            expect(queryByDisplayValue('2')).not.toBeInTheDocument();
            expect(queryByDisplayValue('1')).not.toBeInTheDocument();
        });
    });
});
