import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MaskedInput } from './index';

// prettier-ignore
const cardMask = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

describe('MaskedInput', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<MaskedInput />)).toMatchSnapshot();
        });
    });

    it('should format input according to mask', async () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<MaskedInput mask={cardMask} dataTestId={dataTestId} />);

        const input = getByTestId(dataTestId);

        await userEvent.type(input, 'before1234123412341234after±!@#$%^&*()_+');

        userEvent.click(getByTestId(dataTestId));

        expect(input).toHaveValue('1234 1234 1234 1234');
    });

    it('should format value according to mask', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MaskedInput
                value='before1234123412341234after±!@#$%^&*()_+'
                mask={cardMask}
                dataTestId={dataTestId}
            />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        userEvent.click(input);

        expect(input).toHaveValue('1234 1234 1234 1234');
    });

    it('should format defaultValue according to mask', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MaskedInput
                defaultValue='before1234123412341234after±!@#$%^&*()_+'
                mask={cardMask}
                dataTestId={dataTestId}
            />,
        );

        const input = getByTestId(dataTestId) as HTMLInputElement;

        userEvent.click(input);

        expect(input).toHaveValue('1234 1234 1234 1234');
    });

    it('should call `onChange` prop and pass masked value', async () => {
        const cb = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(
            <MaskedInput mask={cardMask} value='123' onChange={cb} dataTestId={dataTestId} />,
        );

        const input = getByTestId(dataTestId);

        fireEvent.change(input, { target: { value: 'before1234123412341234after±!@#$%^&*()_+' } });

        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.calls[0][1].value).toBe('1234 1234 1234 1234');
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<MaskedInput />);

        expect(unmount).not.toThrowError();
    });
});
