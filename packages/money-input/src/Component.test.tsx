import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { MoneyInput } from './index';

const THINSP = String.fromCharCode(8201);
// prettier-ignore

describe('MoneyInput', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<MoneyInput />)).toMatchSnapshot();
        });
    });

    it('should render passed amount', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MoneyInput
                amount={{
                    value: 1234500,
                    currency: 'RUR',
                    minorUnits: 100,
                }}
                dataTestId={dataTestId}
            />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        expect(input.value).toBe(`12${THINSP}345,00`);
    });

    it('should render empty input if passed amount.value is 0', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MoneyInput
                amount={{
                    value: 0,
                    currency: 'RUR',
                    minorUnits: 100,
                }}
                dataTestId={dataTestId}
            />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        expect(input.value).toBe('');
    });

    it('should render passed decimal amount', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MoneyInput
                amount={{
                    value: 1234567,
                    currency: 'RUR',
                    minorUnits: 100,
                }}
                dataTestId={dataTestId}
            />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        expect(input.value).toBe(`12${THINSP}345,67`);
    });

    it('should allow input digital symbols', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MoneyInput
                amount={{
                    value: 0,
                    currency: 'RUR',
                    minorUnits: 100,
                }}
                dataTestId={dataTestId}
            />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        fireEvent.change(input, { target: { value: '123456' } });
        expect(input.value).toBe(`123${THINSP}456`);

        fireEvent.change(input, { target: { value: '123,' } });
        expect(input.value).toBe('123,');

        fireEvent.change(input, { target: { value: '123.' } });
        expect(input.value).toBe('123,');
    });

    it('should prevent input of non digital symbols', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MoneyInput
                amount={{
                    value: 1234500,
                    currency: 'RUR',
                    minorUnits: 100,
                }}
                dataTestId={dataTestId}
            />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'f' } });
        expect(input.value).toBe(`12${THINSP}345,00`);

        fireEvent.change(input, { target: { value: '!' } });
        expect(input.value).toBe(`12${THINSP}345,00`);
    });

    /**
     * 100003 вставить ',' после 100
     * 100003 вставить '.' после 100
     * максимум 12 символов в мажорной части и не более 2х в минорной
     * 1234 каретка перед двойкой backspace
     * Тест на то что если amount зацикливать то все ок
     * Тест на то что если задать amount1 раз - все работает
     * Тест при вставке невалидного символа каретка не двигается
     */
});
