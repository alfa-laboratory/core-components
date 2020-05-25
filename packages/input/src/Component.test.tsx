import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from './index';

describe('Input', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<Input value='value' onChange={jest.fn()} />)).toMatchSnapshot();
        });
    });

    it('should forward ref to input', () => {
        const inputRef = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Input ref={inputRef} dataTestId={dataTestId} />);

        expect(inputRef.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    it('should set `data-test-id` atribute to input', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Input block={true} dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('INPUT');
    });

    describe('Classes tests', () => {
        it('should set `className` class to root', () => {
            const className = 'test-class';
            const { container } = render(<Input className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `inputClassName` class to input', () => {
            const dataTestId = 'test-id';
            const className = 'test-class';
            const { getByTestId } = render(
                <Input inputClassName={className} dataTestId={dataTestId} />,
            );

            expect(getByTestId(dataTestId)).toHaveClass(className);
        });

        it('should set `filled` class', () => {
            const { container } = render(<Input value='some value' readOnly={true} />);

            expect(container.firstElementChild).toHaveClass('filled');
        });

        it('should set `hasLabel` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Input label='label' dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toHaveClass('hasLabel');
        });

        it('should set `hasInputAddons` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Input leftAddons='label' dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toHaveClass('hasInputAddons');
        });

        it('should set `disabled` atribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Input disabled={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toHaveAttribute('disabled');
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onChange` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const value = '123';
            const { getByTestId } = render(<Input onChange={cb} dataTestId={dataTestId} />);

            const input = getByTestId(dataTestId) as HTMLInputElement;

            fireEvent.change(input, { target: { value } });

            expect(cb).toBeCalledTimes(1);
            expect(input.value).toBe(value);
        });

        it('should call `onFocus` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Input onFocus={cb} dataTestId={dataTestId} />);

            fireEvent.focus(getByTestId(dataTestId));

            expect(cb).toBeCalledTimes(1);
        });

        it('should call `onBlur` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Input onBlur={cb} dataTestId={dataTestId} />);

            fireEvent.blur(getByTestId(dataTestId));

            expect(cb).toBeCalledTimes(1);
        });

        it('should not call `onChange` prop if disabled', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(
                <Input onChange={cb} dataTestId={dataTestId} disabled={true} />,
            );

            const input = getByTestId(dataTestId) as HTMLInputElement;

            await userEvent.type(input, '123');

            expect(cb).not.toBeCalled();
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Input value='value' onChange={jest.fn()} />);

        expect(unmount).not.toThrowError();
    });
});
