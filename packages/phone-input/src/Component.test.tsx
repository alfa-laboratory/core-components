import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PhoneInput } from './index';

describe('PhoneInput', () => {
    const dataTestId = 'test-id';

    it('should match snapshot', () => {
        expect(render(<PhoneInput />)).toMatchSnapshot();
    });

    describe('should right delete number', () => {
        it('"+7 1" -> press backspace -> "+7 "', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '+7 1' } });
            userEvent.type(inputElement, '{backspace}');
            expect(inputElement.value).toBe('+7 ');
        });
        /*
         * TODO: хотелось бы добавить тестов на проверку удаления цифр в номере,
         * но не нашел способа двигать каретку
         */
    });

    describe('should format a phone number according default to mask', () => {
        it('input "+" -> "+7 "', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '+' } });
            expect(inputElement.value).toBe('+7 ');
        });

        it('input "7" -> "+7 "', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '7' } });
            expect(inputElement.value).toBe('+7 ');
        });

        it('input "8" -> "+7 "', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            userEvent.type(inputElement, '8');
            expect(inputElement.value).toBe('+7 ');
        });

        it('input "1" -> "+7 1"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            userEvent.type(inputElement, '1');
            expect(inputElement.value).toBe('+7 1');
        });

        it('insert "+71112223344" -> "+7 111 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '+71112223344' } });
            expect(inputElement.value).toBe('+7 111 222-33-44');
        });

        it('insert "81112223344" -> "+7 111 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '81112223344' } });
            expect(inputElement.value).toBe('+7 111 222-33-44');
        });

        it('insert "1112223344" -> "+7 111 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '1112223344' } });
            expect(inputElement.value).toBe('+7 111 222-33-44');
        });

        it('insert "8882223344" -> "+7 888 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '8882223344' } });
            expect(inputElement.value).toBe('+7 888 222-33-44');
        });

        it('insert "71112223344" -> "+7 111 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '71112223344' } });
            expect(inputElement.value).toBe('+7 111 222-33-44');
        });

        it('insert "8 (777) 222-33-44" -> "+7 777 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '8 (777) 222-33-44' } });
            expect(inputElement.value).toBe('+7 777 222-33-44');
        });

        it('insert "111222334455" -> "+7 111 222-33-44"', () => {
            const { getByTestId } = render(<PhoneInput dataTestId={dataTestId} />);
            const inputElement = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(inputElement, { target: { value: '111222334455' } });
            expect(inputElement.value).toBe('+7 111 222-33-44');
        });
    });
});
