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
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<Input value='value' onChange={jest.fn()} />)).toMatchSnapshot();
        });

        it('should render label', () => {
            expect(render(<Input label={<span>This is label</span>} />)).toMatchSnapshot();
        });

        it('should render hint', () => {
            expect(render(<Input hint='This is hint' />)).toMatchSnapshot();
        });

        it('should render error', () => {
            expect(render(<Input error='This is error' />)).toMatchSnapshot();
        });

        it('should not render hint if has error', () => {
            const result = render(<Input error='error' hint='hint' />);

            expect(result).toMatchSnapshot();
            expect(result.queryByText('hint')).toBeNull();
        });

        it('should render left addons', () => {
            expect(render(<Input leftAddons={<div>Left addons</div>} />)).toMatchSnapshot();
        });

        it('should render right addons', () => {
            expect(render(<Input rightAddons={<div>Right addons</div>} />)).toMatchSnapshot();
        });

        it('should render bottom addons', () => {
            expect(render(<Input bottomAddons={<div>Bottom addons</div>} />)).toMatchSnapshot();
        });
    });

    it('should forward ref to input', () => {
        const inputRef = jest.fn();
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Input ref={inputRef} dataTestId={dataTestId} />);

        expect(inputRef.mock.calls).toEqual([[getByTestId(dataTestId)]]);
    });

    it('should set `data-test-id` atribute', () => {
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

            expect(getByTestId(dataTestId).classList).toContain(className);
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<Input size={size} />);

            expect(container.firstElementChild).toHaveClass(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<Input block={true} />);

            expect(container.firstElementChild).toHaveClass('block');
        });

        it('should set `filled` class', () => {
            const { container } = render(<Input value='some value' readOnly={true} />);

            expect(container.firstElementChild).toHaveClass('filled');
        });

        it('should set `hasLabel` class', () => {
            const { container } = render(<Input label='label' />);

            expect(container.firstElementChild).toHaveClass('hasLabel');
        });

        it('should set `hasError` class', () => {
            const { container } = render(<Input error='error' />);

            expect(container.firstElementChild).toHaveClass('hasError');
        });

        it('should set `disabled` class and atribute', () => {
            const dataTestId = 'test-id';
            const { container, getByTestId } = render(
                <Input disabled={true} dataTestId={dataTestId} />,
            );

            expect(getByTestId(dataTestId)).toHaveAttribute('disabled');
            expect(container.firstElementChild).toHaveClass('disabled');
        });

        it('should set `focused` class after focus', () => {
            const dataTestId = 'test-id';
            const { getByTestId, container } = render(<Input dataTestId={dataTestId} />);

            fireEvent.focus(getByTestId(dataTestId));

            expect(container.firstElementChild).toHaveClass('focused');
        });

        it('should unset `focused` class after blur', () => {
            const dataTestId = 'test-id';
            const { getByTestId, container } = render(<Input dataTestId={dataTestId} />);

            fireEvent.focus(getByTestId(dataTestId));
            fireEvent.blur(getByTestId(dataTestId));

            expect(container.firstElementChild?.classList).not.toContain('focused');
        });
    });

    describe('Callbacks tests', () => {
        it('should call `onChange` prop', () => {
            const cb = jest.fn();
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Input onChange={cb} dataTestId={dataTestId} />);

            fireEvent.change(getByTestId(dataTestId), { target: { value: '123' } });

            expect(cb).toBeCalledTimes(1);
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
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Input value='value' onChange={jest.fn()} />);

        expect(unmount).not.toThrowError();
    });
});
