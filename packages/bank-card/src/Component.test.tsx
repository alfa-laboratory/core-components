import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { LogoAlfabankMColorIcon } from '@alfalab/icons-classic';

import { BankCard } from './index';

describe('BankCard', () => {
    describe('Snapshots tests', () => {
        it('should match snapshots', () => {
            expect(render(<BankCard value='4111 1111 1111 1111' />).container).toMatchSnapshot();
            expect(render(<BankCard value='5500 0000 0000 0004' />).container).toMatchSnapshot();
            expect(render(<BankCard value='2201 3820 0000 0013' />).container).toMatchSnapshot();
            expect(
                render(<BankCard value='1234 1234 1234 1234 1234' />).container,
            ).toMatchSnapshot();
        });
    });

    it('should forward ref to input', () => {
        const inputRef = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<BankCard ref={inputRef} dataTestId={dataTestId} />);

        expect(inputRef.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    it('should set `data-test-id` atribute to input', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<BankCard dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('INPUT');
    });

    it('should format card number according to mask', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<BankCard dataTestId={dataTestId} />);

        const input = getByTestId(dataTestId) as HTMLInputElement;

        fireEvent.change(input, { target: { value: '4444444444444444' } });

        expect(input.value).toBe('4444 4444 4444 4444');
    });

    it('should format account number according to mask', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<BankCard dataTestId={dataTestId} />);

        const input = getByTestId(dataTestId) as HTMLInputElement;

        fireEvent.change(input, { target: { value: '44444444444444444444' } });

        expect(input.value).toBe('4444 4444 4444 4444 4444');
    });

    it('should set custom label', () => {
        const label = 'Custom label';
        const { container } = render(<BankCard inputLabel={label} />);

        expect(container).toHaveTextContent(label);
    });

    it('should set custom background', () => {
        const backgroundColor = '#b000b5';
        const { container } = render(<BankCard backgroundColor={backgroundColor} />);

        expect(container.querySelector('.content')).toHaveStyle({
            backgroundColor,
        });
    });

    it('should set custom bank logo', () => {
        const dataTestId = 'test-id';
        const logo = (
            <div data-test-id={dataTestId}>
                <LogoAlfabankMColorIcon />
            </div>
        );
        const { getByTestId } = render(<BankCard bankLogo={logo} />);

        expect(getByTestId(dataTestId)).toBeTruthy();
    });

    describe('Callbacks tests', () => {
        it('should call `onChange` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const value = '4444 4444 4444 4444 ';
            const { getByTestId } = render(<BankCard onChange={cb} dataTestId={dataTestId} />);

            const input = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(input, { target: { value } });

            expect(cb).toBeCalledTimes(1);
            expect(input.value).toBe(value);
        });

        it('should call `onUsePhoto` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByRole } = render(<BankCard onUsePhoto={cb} dataTestId={dataTestId} />);

            fireEvent.click(getByRole('button'));

            expect(cb).toBeCalledTimes(1);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<BankCard value='value' onChange={jest.fn()} />);

        expect(unmount).not.toThrowError();
    });
});
