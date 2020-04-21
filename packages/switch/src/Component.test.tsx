import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Switch } from './index';

describe('Switch', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<Switch label='label' hint='hint' />)).toMatchSnapshot();
        });

        it('should render only switch if no content', () => {
            expect(render(<Switch />)).toMatchSnapshot();
        });
    });

    describe('Classes tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';
            const { container } = render(<Switch className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `checked` class', () => {
            const { container } = render(<Switch checked={true} />);

            expect(container.firstElementChild).toHaveClass('checked');
        });

        it('should set `disabled` class', () => {
            const { container } = render(<Switch disabled={true} />);

            expect(container.firstElementChild).toHaveClass('disabled');
        });
        it('should set `reversed` class', () => {
            const { container } = render(<Switch reversed={true} />);

            expect(container.firstElementChild).toHaveClass('reversed');
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` atribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Switch dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).tagName).toBe('INPUT');
        });

        it('should set disabled attribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Switch disabled={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toBeDisabled();
        });

        it('should set checked attribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Switch checked={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId)).toBeChecked();
        });
    });

    describe('Render tests', () => {
        test('should unmount without errors', () => {
            const { unmount } = render(<Switch />);

            expect(unmount).not.toThrowError();
        });
    });

    describe('Interaction tests', () => {
        test('should call `onChange` prop if not disabled', () => {
            const cb = jest.fn();

            const { container } = render(<Switch onChange={cb} checked={true} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).toBeCalledTimes(1);
        });

        test('should not call `onChange` prop if disabled', () => {
            const cb = jest.fn();

            const { container } = render(<Switch onChange={cb} disabled={true} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).not.toBeCalled();
        });

        test('should not call `onChange` prop if disabled and checked', () => {
            const cb = jest.fn();

            const { container } = render(<Switch onChange={cb} checked={true} disabled={true} />);

            if (container.firstElementChild) {
                fireEvent.click(container.firstElementChild);
            }

            expect(cb).not.toBeCalled();
        });
    });
});
