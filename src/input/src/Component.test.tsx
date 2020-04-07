/**
 * Vendor
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';

/**
 * Component
 */

import { Input } from './index';

describe('Input', () => {
    it('should match snapshot', () => {
        expect(render(<Input />)).toMatchSnapshot();
    });

    it('should set `data-test-id` atribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Input block={true} dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toBeTruthy();
    });

    describe('classNames', () => {
        it('should set `className` class to root', () => {
            const className = 'test-class';
            const { container } = render(<Input className={className} />);

            expect(container.firstElementChild?.classList).toContain(className);
        });

        it('should set `inputClassName` class to input', () => {
            const className = 'test-class';
            const { container } = render(<Input inputClassName={className} />);

            const input = container.querySelector('input');

            expect(input?.classList).toContain(className);
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<Input size={size} />);

            expect(container.firstElementChild?.classList).toContain(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<Input block={true} />);

            expect(container.firstElementChild?.classList).toContain('block');
        });

        it('should set `filled` class', () => {
            const { container } = render(<Input value='some value' readOnly={true} />);

            expect(container.firstElementChild?.classList).toContain('filled');
        });

        it('should set `hasLabel` class', () => {
            const { container } = render(<Input label='label' />);

            expect(container.firstElementChild?.classList).toContain('hasLabel');
        });

        it('should set `hasError` class', () => {
            const { container } = render(<Input error='error' />);

            expect(container.firstElementChild?.classList).toContain('hasError');
        });

        it('should set `disabled` class and atribute', () => {
            const { container } = render(<Input disabled={true} />);
            const input = container.querySelector('input');

            expect(input).toHaveAttribute('disabled');
            expect(container.firstElementChild?.classList).toContain('disabled');
        });

        it('should set `focused` class after focus', () => {
            const dataTestId = 'test-id';
            const { getByTestId, container } = render(<Input dataTestId={dataTestId} />);

            const input = container.querySelector('input');
            if (input) fireEvent.focus(input);

            expect(getByTestId(dataTestId).classList).toContain('focused');
        });

        it('should unset `focused` class after blur', () => {
            const dataTestId = 'test-id';
            const { getByTestId, container } = render(<Input dataTestId={dataTestId} />);

            const input = container.querySelector('input');
            if (input) {
                fireEvent.focus(input);
                fireEvent.blur(input);
            }

            expect(getByTestId(dataTestId).classList).not.toContain('focused');
        });
    });

    describe('callbacks', () => {
        it('should call `onChange` prop', () => {
            const cb = jest.fn();
            const { container } = render(<Input onChange={cb} />);

            const input = container.querySelector('input');
            if (input) {
                fireEvent.change(input, { target: { value: '123' } });
            }

            expect(cb).toBeCalledTimes(1);
        });

        it('should call `onFocus` prop', () => {
            const cb = jest.fn();
            const { container } = render(<Input onFocus={cb} />);

            const input = container.querySelector('input');
            if (input) {
                fireEvent.focus(input);
            }

            expect(cb).toBeCalledTimes(1);
        });

        it('should call `onBlur` prop', () => {
            const cb = jest.fn();
            const { container } = render(<Input onBlur={cb} />);

            const input = container.querySelector('input');
            if (input) {
                fireEvent.blur(input);
            }

            expect(cb).toBeCalledTimes(1);
        });
    });

    describe('render', () => {
        it('should forward ref to input', () => {
            const inputRef = jest.fn();
            const { container } = render(<Input ref={inputRef} />);
            const input = container.querySelector('input');

            expect(inputRef.mock.calls).toEqual([[input]]);
        });

        it('should render label', () => {
            const labelText = 'This is label';
            const { container, getByText } = render(<Input label={<span>{labelText}</span>} />);

            expect(container).toContainElement(getByText(labelText));
        });

        it('should render hint', () => {
            const hintText = 'This is hint';
            const { container, getByText } = render(<Input hint={hintText} />);

            expect(container).toContainElement(getByText(hintText));
        });

        it('should render error', () => {
            const errorText = 'This is error';
            const { container, getByText } = render(<Input error={errorText} />);

            expect(container).toContainElement(getByText(errorText));
        });

        it('should not render hint if has error', () => {
            const hintText = 'This is hint';
            const { queryByText } = render(<Input error='error' hint={hintText} />);

            expect(queryByText(hintText)).toBeNull();
        });

        it('should render left addons', () => {
            const addonsText = 'Left addons';
            const { container, getByText } = render(<Input leftAddons={<div>{addonsText}</div>} />);

            expect(container).toContainElement(getByText(addonsText));
        });

        it('should render right addons', () => {
            const addonsText = 'Right addons';
            const { container, getByText } = render(
                <Input rightAddons={<div>{addonsText}</div>} />,
            );

            expect(container).toContainElement(getByText(addonsText));
        });

        it('should render bottom addons', () => {
            const addonsText = 'Bottom addons';
            const { container, getByText } = render(
                <Input bottomAddons={<div>{addonsText}</div>} />,
            );

            expect(container).toContainElement(getByText(addonsText));
        });
    });
});
