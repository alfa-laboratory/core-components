/**
 * @jest-environment jsdom-sixteen
 */

import React, { useState } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MoneyInput, CurrencyCodes } from './index';

const THINSP = String.fromCharCode(8201);

describe('MoneyInput', () => {
    function renderMoneyInput(value: number | null) {
        // TODO: почему тесты в кор компонентах цепляются к data-test-id вместо label?
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MoneyInput value={value} currency='RUR' minority={100} dataTestId={dataTestId} />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        return input;
    }

    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<MoneyInput />)).toMatchSnapshot();
            expect(
                render(<MoneyInput value={1234567} currency='USD' minority={100} />),
            ).toMatchSnapshot();
        });
    });

    it('should use default placeholder', () => {
        const input = renderMoneyInput(null);
        expect(input.placeholder).toBe(`0${THINSP}₽`);
    });

    it('should use passed placeholder', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MoneyInput
                value={null}
                currency='RUR'
                minority={100}
                dataTestId={dataTestId}
                placeholder='Сумма'
            />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;
        expect(input.placeholder).toBe('Сумма');
    });

    it('should render passed amount', () => {
        const input = renderMoneyInput(1234500);
        expect(input.value).toBe(`12${THINSP}345,00`);
    });

    it('should render empty input if passed amount.value is null', () => {
        const input = renderMoneyInput(null);
        expect(input.value).toBe('');
    });

    it('should render 0,00 in input if passed amount.value is 0', () => {
        const input = renderMoneyInput(0);
        expect(input.value).toBe('0,00');
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

    it('should avoid inserting leading zero before number, but allow inserting zero', async () => {
        const input = renderMoneyInput(null);
        await userEvent.type(input, '0');
        expect(input.value).toBe('0');
        await userEvent.type(input, '1234');
        expect(input.value).toBe(`1${THINSP}234`);
        input.focus();
        input.setSelectionRange(0, 0);
        await userEvent.type(input, '0', { initialSelectionStart: 0, initialSelectionEnd: 0 });
        expect(input.value).toBe(`1${THINSP}234`);
        fireEvent.change(input, { target: { value: '' } });
        await userEvent.type(input, '0');
        expect(input.value).toBe('0');
    });

    it('should allow replace minor part without deleting', async () => {
        const input = renderMoneyInput(1234500);

        input.focus();
        input.setSelectionRange(7, 7);

        await userEvent.type(input, '6', { initialSelectionStart: 7, initialSelectionEnd: 7 });
        expect(input.value).toBe(`12${THINSP}345,60`);
    });

    it('should allow to past value with spaces', async () => {
        const input = renderMoneyInput(null);

        await userEvent.paste(input, '1 23');
        expect(input.value).toBe('123');
    });

    it('should delete symbols on delete button press event', async () => {
        const input = renderMoneyInput(null);

        await userEvent.type(input, '123,45');
        input.focus();
        input.setSelectionRange(1, 1);
        await userEvent.type(input, '{del}', { initialSelectionStart: 1, initialSelectionEnd: 1 });
        expect(input.value).toBe('13,45');
    });

    it('should allow set carret in the middle and enter decimal divider symbol', async () => {
        const input = renderMoneyInput(null);

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
        const input = renderMoneyInput(null);

        await userEvent.type(input, '1234');
        expect(input.value).toBe(`1${THINSP}234`);
        input.setSelectionRange(2, 2);
        await userEvent.type(input, '{backspace}');

        expect(input.value).toBe(`1${THINSP}234`);
    });

    it('should render new amount from props (looped value)', async () => {
        const dataTestId = 'test-id';
        let setAmountManually: (value: number, currency: CurrencyCodes, minority: number) => void;
        const HOCWithAmountInState = () => {
            const [value, setValue] = useState<number | null>(200);
            const [currency, setCurrency] = useState<CurrencyCodes>('RUR');
            const [minority, setMinority] = useState(100);

            setAmountManually = (
                value: number | null,
                currency: CurrencyCodes,
                minority: number,
            ) => {
                setValue(value);
                setCurrency(currency);
                setMinority(minority);
            };

            return (
                <MoneyInput
                    value={value}
                    currency={currency}
                    minority={minority}
                    dataTestId={dataTestId}
                    onChange={(e, payload) => setValue(payload.value)}
                />
            );
        };

        const { getByTestId } = render(<HOCWithAmountInState />);

        const input = getByTestId(dataTestId) as HTMLInputElement;

        await userEvent.type(input, '{backspace}{backspace}{backspace}{backspace}5678');

        expect(input.value).toBe(`5${THINSP}678`);

        act(() => {
            setAmountManually(34567, 'USD', 100);
        });

        expect(input.value).toBe('345,67');

        await userEvent.clear(input);

        expect(input.value).toBe('');

        await userEvent.type(input, '0,');

        expect(input.value).toBe('0,');

        act(() => {
            setAmountManually(1, 'USD', 100);
        });

        expect(input.value).toBe('0,01');
    });

    /**
     * + тест на адекватность (снапшот)
     * + тест на дефолтные значения (нужно разобраться про label)
     * - проброс пропсов
     * + 100003 вставить ',' после 100
     * + 100003 вставить '.' после 100
     * максимум 12 символов в мажорной части и не более 2х в минорной
     * + 1234 каретка перед двойкой backspace
     * + Тест на то что если amount зацикливать то все ок
     * - Тест при вставке невалидного символа каретка не двигается
     */
});
