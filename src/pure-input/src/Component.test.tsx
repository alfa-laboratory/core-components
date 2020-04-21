import React from 'react';
import { render } from '@testing-library/react';

import { PureInput } from './index';

describe('PureInput', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<PureInput value='value' onChange={jest.fn()} />)).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` atribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<PureInput block={true} dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).tagName).toBe('INPUT');
        });
    });

    describe('Classes tests', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<PureInput className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<PureInput size={size} />);

            expect(container.firstElementChild).toHaveClass(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<PureInput block={true} />);

            expect(container.firstElementChild).toHaveClass('block');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<PureInput value='value' onChange={jest.fn()} />);

        expect(unmount).not.toThrowError();
    });
});
