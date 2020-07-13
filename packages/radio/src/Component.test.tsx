import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Radio } from './index';

describe('Radio', () => {
    describe('Display tests', () => {
        it('should display correctly', () => {
            expect(render(<Radio label='text' />)).toMatchSnapshot();
        });

        it('should display with description correctly', () => {
            expect(render(<Radio hint='hint' label='text' />)).toMatchSnapshot();
        });
    });

    describe('Styles tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';
            const { container } = render(<Radio className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `checked` class', () => {
            const { container } = render(<Radio checked={true} />);

            expect(container.firstElementChild).toHaveClass('checked');
        });

        it('should set `disabled` class', () => {
            const { container } = render(<Radio disabled={true} />);

            expect(container.firstElementChild).toHaveClass('disabled');
        });

        describe('Attributes tests', () => {
            it('should set `data-test-id` atribute', () => {
                const dataTestId = 'test-id';
                const { getByTestId } = render(<Radio dataTestId={dataTestId} />);

                expect(getByTestId(dataTestId).tagName).toBe('INPUT');
            });

            it('should set disabled attribute', () => {
                const dataTestId = 'test-id';
                const { getByTestId } = render(<Radio disabled={true} dataTestId={dataTestId} />);

                expect(getByTestId(dataTestId)).toBeDisabled();
            });

            it('should set checked attribute', () => {
                const dataTestId = 'test-id';
                const { getByTestId } = render(<Radio checked={true} dataTestId={dataTestId} />);

                expect(getByTestId(dataTestId)).toBeChecked();
            });
        });
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<Radio />);

            expect(unmount).not.toThrowError();
        });
    });

    describe('Interaction tests', () => {
        test('should not call `onChange` prop if checked', () => {
            const cb = jest.fn();

            const { container } = render(<Radio onChange={cb} checked={true} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).toBeCalledTimes(0);
        });

        test('should call `onChange` prop if checked', () => {
            const cb = jest.fn();

            const { container } = render(<Radio onChange={cb} checked={false} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).toBeCalledTimes(1);
        });

        test('should not call `onChange` prop if disabled', () => {
            const cb = jest.fn();

            const { container } = render(<Radio onChange={cb} disabled={true} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).not.toBeCalled();
        });

        test('should not call `onChange` prop if disabled and checked', () => {
            const cb = jest.fn();

            const { container } = render(<Radio onChange={cb} checked={true} disabled={true} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).not.toBeCalled();
        });
    });
});
