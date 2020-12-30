import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Checkbox } from './index';

describe('Checkbox', () => {
    describe('Display tests', () => {
        it('should display correctly', () => {
            expect(render(<Checkbox label='label' hint='hint' />)).toMatchSnapshot();
        });

        it('should display indeterminate correctly', () => {
            expect(
                render(<Checkbox label='label' hint='hint' indeterminate={true} />),
            ).toMatchSnapshot();
        });
    });

    describe('Styles tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';
            const { container } = render(<Checkbox className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `checked` class', () => {
            const { container } = render(<Checkbox checked={true} />);

            expect(container.firstElementChild).toHaveClass('checked');
        });

        it('should set `disabled` class', () => {
            const { container } = render(<Checkbox disabled={true} />);

            expect(container.firstElementChild).toHaveClass('disabled');
        });

        it('should set `indeterminate` class', () => {
            const { container } = render(<Checkbox indeterminate={true} />);

            expect(container.firstElementChild).toHaveClass('indeterminate');
        });

        it('should set size `s` as default size', () => {
            const { container } = render(<Checkbox />);

            expect(container.firstElementChild).toHaveClass('s');
        });

        it('should set size', () => {
            const { container } = render(<Checkbox size='m' />);

            expect(container.firstElementChild).toHaveClass('m');
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` atribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Checkbox dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).tagName).toBe('INPUT');
        });

        it('should set disabled attribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Checkbox disabled={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toBeDisabled();
        });

        it('should set checked attribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Checkbox checked={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toBeChecked();
        });
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<Checkbox />);

            expect(unmount).not.toThrowError();
        });
    });

    describe('Interaction tests', () => {
        test('should call `onChange` prop if not disabled', () => {
            const cb = jest.fn();

            const { container } = render(<Checkbox onChange={cb} checked={true} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).toBeCalledTimes(1);
        });

        test('should not call `onChange` prop if disabled', () => {
            const cb = jest.fn();

            const { container } = render(<Checkbox onChange={cb} disabled={true} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).not.toBeCalled();
        });

        test('should not call `onChange` prop if disabled and checked', () => {
            const cb = jest.fn();

            const { container } = render(<Checkbox onChange={cb} checked={true} disabled={true} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).not.toBeCalled();
        });
    });
});
