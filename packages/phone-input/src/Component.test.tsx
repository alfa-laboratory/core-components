import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PhoneInput } from './index';

describe('PhoneInput', () => {
    const dataTestId = 'test-id';

    it('should match snapshot', () => {
        expect(render(<PhoneInput />)).toMatchSnapshot();
    });

    it('should not delete "+7" when "+7 1" is in input and delete button press event', () => {
        const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
        const inputElement = getByTestId(dataTestId) as HTMLInputElement;

        fireEvent.change(inputElement, { target: { value: '+7 1' } });
        userEvent.type(inputElement, '{backspace}');
        expect(inputElement.value).toBe('+7 ');
    });

    describe('should format a phone number according default to mask', () => {
        it('"+" -> "+7 "', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '+' } });
            expect(inputElement.value).toBe('+7 ');
        });

        it('"7" -> "+7 "', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '7' } });
            expect(inputElement.value).toBe('+7 ');
        });

        it('"8" -> "+7 "', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '8' } });
            expect(inputElement.value).toBe('+7 ');
        });

        it('"5" -> "+7 1"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '1' } });
            expect(inputElement.value).toBe('+7 1');
        });

        it('"+71112223344" -> "+7 111 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '+71112223344' } });
            expect(inputElement.value).toBe('+7 111 222-33-44');
        });

        it('"81112223344" -> "+7 111 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '81112223344' } });
            expect(inputElement.value).toBe('+7 111 222-33-44');
        });

        it('"1112223344" -> "+7 111 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '1112223344' } });
            expect(inputElement.value).toBe('+7 111 222-33-44');
        });

        it('"8882223344" -> "+7 888 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '8882223344' } });
            expect(inputElement.value).toBe('+7 888 222-33-44');
        });

        it('"7772223344" -> "+7 777 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '7772223344' } });
            expect(inputElement.value).toBe('+7 777 222-33-44');
        });

        it('"8 (777) 222-33-44" -> "+7 777 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '8 (777) 222-33-44' } });
            expect(inputElement.value).toBe('+7 777 222-33-44');
        });

        it('"111222334455" -> "+7 111 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '111222334455' } });
            expect(inputElement.value).toBe('+7 111 222-33-44');
        });
    });
});
