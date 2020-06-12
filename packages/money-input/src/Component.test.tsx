/**
 * @jest-environment jsdom-sixteen
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MoneyInput } from './index';

const THINSP = String.fromCharCode(8201);

describe('MoneyInput', () => {
    function renderMoneyInput(value: number) {
        // TODO: почему тесты в кор компонентах цепляются к data-test-id вместо label?
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MoneyInput
                amount={{
                    value,
                    currency: 'RUR',
                    minorUnits: 100,
                }}
                dataTestId={dataTestId}
            />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        return input;
    }

    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<MoneyInput />)).toMatchSnapshot();
            expect(
                render(
                    <MoneyInput amount={{ value: 1234567, currency: 'USD', minorUnits: 100 }} />,
                ),
            ).toMatchSnapshot();
        });
    });

    it('should render passed amount', () => {
        const input = renderMoneyInput(1234500);
        expect(input.value).toBe(`12${THINSP}345,00`);
    });

    it('should render empty input if passed amount.value is 0', () => {
        const input = renderMoneyInput(0);
        expect(input.value).toBe('');
    });

    it('should render passed decimal amount', () => {
        const input = renderMoneyInput(1234567);
        expect(input.value).toBe(`12${THINSP}345,67`);
    });

    it('should allow input correct amounts', () => {
        const input = renderMoneyInput(0);

        fireEvent.change(input, { target: { value: '123456' } });
        expect(input.value).toBe(`123${THINSP}456`);

        fireEvent.change(input, { target: { value: '123,' } });
        expect(input.value).toBe('123,');

        fireEvent.change(input, { target: { value: '123.' } });
        expect(input.value).toBe('123,');

        fireEvent.change(input, { target: { value: '123,4' } });
        expect(input.value).toBe('123,4');

        fireEvent.change(input, { target: { value: '123.4' } });
        expect(input.value).toBe('123,4');

        fireEvent.change(input, { target: { value: '123,45' } });
        expect(input.value).toBe('123,45');

        fireEvent.change(input, { target: { value: '123.45' } });
        expect(input.value).toBe('123,45');

        fireEvent.change(input, { target: { value: '123456789' } });
        expect(input.value).toBe(`123${THINSP}456${THINSP}789`);

        fireEvent.change(input, { target: { value: '123456789,12' } });
        expect(input.value).toBe(`123${THINSP}456${THINSP}789,12`);

        fireEvent.change(input, { target: { value: '123456789.12' } });
        expect(input.value).toBe(`123${THINSP}456${THINSP}789,12`);
    });

    it('should prevent input of incorrect amounts', () => {
        const input = renderMoneyInput(1234500);

        fireEvent.change(input, { target: { value: 'f' } });
        expect(input.value).toBe(`12${THINSP}345,00`);

        fireEvent.change(input, { target: { value: '!' } });
        expect(input.value).toBe(`12${THINSP}345,00`);
    });

    it('should allow set carret in the middle and enter decimal divider symbol', async () => {
        const input = renderMoneyInput(0);

        await userEvent.type(input, '123456');

        input.setSelectionRange(4, 4);

        await userEvent.type(input, ',');
        /**
         * TODO: проверить положение картки
         * expect(input.selectionStart).toBe(4);
         */
        expect(input.value).toBe('123,45');

        // userEvent.type коряво внутри работает с кареткой поэтому после каждого ввода восстанавливаем каретку
        input.setSelectionRange(4, 4);
        await userEvent.type(input, '{backspace}');

        input.setSelectionRange(4, 4);
        await userEvent.type(input, '.');
        /**
         * TODO: проверить положение картки
         * expect(input.selectionStart).toBe(4);
         */
        expect(input.value).toBe('123,45');
    });

    it('should not delete any symbol when caret set after space and backspace pressed', async () => {
        const input = renderMoneyInput(0);

        await userEvent.type(input, '1234');
        expect(input.value).toBe(`1${THINSP}234`);
        input.setSelectionRange(2, 2);
        await userEvent.type(input, '{backspace}');

        expect(input.value).toBe(`1${THINSP}234`);
    });

    /**
     * + 100003 вставить ',' после 100
     * + 100003 вставить '.' после 100
     * максимум 12 символов в мажорной части и не более 2х в минорной
     * + 1234 каретка перед двойкой backspace
     * Тест на то что если amount зацикливать то все ок
     * Тест на то что если задать amount1 раз - все работает
     * - Тест при вставке невалидного символа каретка не двигается
     */
});
