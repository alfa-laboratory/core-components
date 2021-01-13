import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
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

    it('should set `aria-label` atribute to input', () => {
        const label = 'label';
        const { getByLabelText } = render(<Input block={true} label={label} />);

        expect(getByLabelText(label).tagName).toBe('INPUT');
    });

    it('should set `disabled` atribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Input disabled={true} dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toHaveAttribute('disabled');
    });

    it('should render error icon', () => {
        const { container } = render(<Input error={true} />);

        expect(container.getElementsByClassName('errorIcon').length).toBe(1);
    });

    it('should render success icon', () => {
        const { container } = render(<Input success={true} />);

        expect(container.getElementsByClassName('successIcon').length).toBe(1);
    });

    it('should not render success icon if has error', () => {
        const { container } = render(<Input success={true} error={true} />);

        expect(container.getElementsByClassName('successIcon').length).toBe(0);
    });

    describe('Classes tests', () => {
        it('should set `className` class to form-control wrapper', () => {
            const { container } = render(<Input className='test-class' />);

            expect(container.querySelector('.test-class')).toHaveClass('component');
        });

        it('should set `fieldClassName` class to form-control field', () => {
            const { container } = render(<Input fieldClassName='test-class' />);

            expect(container.querySelector('.test-class')).toHaveClass('inner');
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
        it('should filledClassName classes when value passed', () => {
            const filledClassName = 'custom-filled-class';
            const { container } = render(
                <Input value='some value' filledClassName={filledClassName} />,
            );

            const component = container.querySelector(`.${filledClassName}`);

            expect(component).toBeInTheDocument();
        });

        it('should not set filledClassName classes if the value is empty', () => {
            const filledClassName = 'custom-filled-class';
            const { container } = render(<Input value='' filledClassName={filledClassName} />);

            expect(container.querySelector(`.${filledClassName}`)).not.toBeInTheDocument();
        });

        it('should unset filledClassName classes if the value becomes empty', () => {
            const filledClassName = 'custom-filled-class';
            const { container, rerender } = render(
                <Input value='some value' filledClassName={filledClassName} />,
            );

            rerender(<Input value='' filledClassName={filledClassName} />);

            expect(container.querySelector(`.${filledClassName}`)).not.toBeInTheDocument();
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

        it('should not show clear button if input is readonly', () => {
            const label = 'Очистить';

            const { queryByLabelText, rerender } = render(<Input clear={true} readOnly={true} />);

            expect(queryByLabelText(label)).not.toBeInTheDocument();

            rerender(<Input clear={true} value='123' readOnly={true} />);

            expect(queryByLabelText(label)).not.toBeInTheDocument();
        });
    });

    describe('when component is uncontrolled', () => {
        it('should filledClassName classes when defaultValue passed', () => {
            const filledClassName = 'custom-filled-class';
            const { container } = render(
                <Input defaultValue='some value' filledClassName={filledClassName} />,
            );

            const component = container.querySelector(`.${filledClassName}`);

            expect(component).toBeInTheDocument();
        });

        it('should not filledClassName classes if the value is empty', () => {
            const filledClassName = 'custom-filled-class';
            const { container } = render(<Input filledClassName={filledClassName} />);

            expect(container.querySelector(`.${filledClassName}`)).not.toBeInTheDocument();
        });

        it('should unset filledClassName classes if value becomes empty', async () => {
            const dataTestId = 'test-id';
            const filledClassName = 'custom-filled-class';
            const { container, getByTestId } = render(
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

            expect(container.querySelector(`.${filledClassName}`)).not.toBeInTheDocument();
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

            await act(async () => {
                userEvent.click(getByLabelText('Очистить'));
            });

            expect(input).toHaveValue('');
        });

        it('should not show clear button if input is readonly', async () => {
            const dataTestId = 'test-id';
            const label = 'Очистить';

            const { queryByLabelText } = render(
                <Input clear={true} dataTestId={dataTestId} defaultValue='123' readOnly={true} />,
            );

            expect(queryByLabelText(label)).not.toBeInTheDocument();
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
