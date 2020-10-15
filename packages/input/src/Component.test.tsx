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

    it('should forward ref to html input', () => {
        const inputRef = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Input ref={inputRef} dataTestId={dataTestId} />);

        expect(inputRef.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    it('should forward ref to input wrapper', () => {
        const ref = (React.createRef() as unknown) as React.MutableRefObject<HTMLDivElement>;
        render(<Input wrapperRef={ref} className='wrapperClassName' />);

        expect(ref.current.classList.contains('wrapperClassName'));
    });

    it('should set `data-test-id` atribute to input', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Input block={true} dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId).tagName).toBe('INPUT');
    });

    it('should set `disabled` atribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Input disabled={true} dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toHaveAttribute('disabled');
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

        it('should set `labelClassName` class to label', () => {
            const className = 'test-class';
            const { container } = render(<Input labelClassName={className} label='label' />);

            expect(container.getElementsByClassName(className).length).toBe(1);
        });

        it('should set `addonsClassName` class to addons', () => {
            const className = 'test-class';
            const { container } = render(
                <Input
                    addonsClassName={className}
                    leftAddons={<div>Left addons</div>}
                    rightAddons={<div>Right addons</div>}
                />,
            );

            expect(container.getElementsByClassName(className).length).toBe(2);
        });

        it('should set `hasLabel` class', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Input label='label' dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toHaveClass('hasLabel');
        });

        it('should set `focusedClassName` when input focused', () => {
            const className = 'test-class';
            const dataTestId = 'test-id';
            const { container, getByTestId } = render(
                <Input focusedClassName={className} dataTestId={dataTestId} />,
            );

            fireEvent.focus(getByTestId(dataTestId));

            expect(container.getElementsByClassName(className).length).toBe(1);
        });
    });

    describe('when component is controlled', () => {
        it('should set `filled` and filledClassName classes when value passed', () => {
            const filledClassName = 'custom-filled-class';
            const { container } = render(
                <Input value='some value' filledClassName={filledClassName} />,
            );

            expect(container.firstElementChild).toHaveClass('filled');
            expect(container.firstElementChild).toHaveClass(filledClassName);
        });

        it('should not set `filled` and filledClassName classes if the value is empty', () => {
            const filledClassName = 'custom-filled-class';
            const { container } = render(<Input value='' filledClassName={filledClassName} />);

            expect(container.firstElementChild).not.toHaveClass('filled');
            expect(container.firstElementChild).not.toHaveClass(filledClassName);
        });

        it('should unset `filled` and filledClassName classes if the value becomes empty', () => {
            const filledClassName = 'custom-filled-class';
            const { container, rerender } = render(
                <Input value='some value' filledClassName={filledClassName} />,
            );

            rerender(<Input value='' filledClassName={filledClassName} />);

            expect(container.firstElementChild).not.toHaveClass('filled');
            expect(container.firstElementChild).not.toHaveClass(filledClassName);
        });

        it('should show clear button only if input has value', () => {
            const cb = jest.fn();
            const label = 'Очистить';

            const { queryByLabelText, rerender } = render(<Input onClear={cb} clear={true} />);

            expect(queryByLabelText(label)).not.toBeInTheDocument();

            rerender(<Input onClear={cb} clear={true} value='123' />);

            expect(queryByLabelText(label)).toBeInTheDocument();
        });

        it('should not actually clear input when clear button clicked', () => {
            const dataTestId = 'test-id';
            const value = '123';
            const { getByTestId, getByLabelText } = render(
                <Input clear={true} value={value} dataTestId={dataTestId} />,
            );

            userEvent.click(getByLabelText('Очистить'));

            expect(getByTestId(dataTestId)).toHaveValue(value);
        });
    });

    describe('when component is uncontrolled', () => {
        it('should set `filled` and filledClassName classes when defaultValue passed', () => {
            const filledClassName = 'custom-filled-class';
            const { container } = render(
                <Input defaultValue='some value' filledClassName={filledClassName} />,
            );

            expect(container.firstElementChild).toHaveClass('filled');
            expect(container.firstElementChild).toHaveClass(filledClassName);
        });

        it('should not set `filled` and filledClassName classes if the value is empty', () => {
            const filledClassName = 'custom-filled-class';
            const { container } = render(<Input filledClassName={filledClassName} />);

            expect(container.firstElementChild).not.toHaveClass('filled');
            expect(container.firstElementChild).not.toHaveClass(filledClassName);
        });

        it('should unset `filled` and filledClassName classes if value becomes empty', async () => {
            const dataTestId = 'test-id';
            const filledClassName = 'custom-filled-class';
            const { getByTestId } = render(
                <Input
                    defaultValue='some value'
                    dataTestId={dataTestId}
                    filledClassName={filledClassName}
                />,
            );

            const input = getByTestId(dataTestId) as HTMLInputElement;

            input.setSelectionRange(0, input.value.length);
            await userEvent.type(input, '{backspace}');

            input.blur();

            expect(input.value).toBe('');
            expect(input).not.toHaveClass('filled');
            expect(input).not.toHaveClass(filledClassName);
        });

        it('should show clear button only if input has value', async () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const label = 'Очистить';

            const { queryByLabelText, getByTestId } = render(
                <Input onClear={cb} clear={true} dataTestId={dataTestId} />,
            );

            const input = getByTestId(dataTestId) as HTMLInputElement;

            expect(queryByLabelText(label)).not.toBeInTheDocument();

            await userEvent.type(input, '123');

            expect(queryByLabelText(label)).toBeInTheDocument();
        });

        it('should clear input when clear button clicked', async () => {
            const dataTestId = 'test-id';
            const { getByTestId, getByLabelText } = render(
                <Input clear={true} dataTestId={dataTestId} />,
            );

            const input = getByTestId(dataTestId) as HTMLInputElement;

            await userEvent.type(input, '123');

            userEvent.click(getByLabelText('Очистить'));

            expect(input).toHaveValue('');
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

        it('should call `onClear` prop when clear button clicked', () => {
            const cb = jest.fn();
            const { getByLabelText } = render(<Input onClear={cb} clear={true} value='123' />);

            userEvent.click(getByLabelText('Очистить'));

            expect(cb).toBeCalledTimes(1);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Input value='value' onChange={jest.fn()} />);

        expect(unmount).not.toThrowError();
    });
});
