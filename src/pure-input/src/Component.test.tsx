/**
 * Vendor
 */

import React from 'react';
import { render } from '@testing-library/react';

/**
 * Component
 */

import { PureInput } from './index';

describe('PureInput', () => {
    it('should match snapshot', () => {
        expect(render(<PureInput />)).toMatchSnapshot();
    });

    it('should set `data-test-id` atribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<PureInput block={true} dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toBeTruthy();
    });

    describe('classNames', () => {
        it('should set `className` class', () => {
            const className = 'test-class';
            const { container } = render(<PureInput className={className} />);

            expect(container.firstElementChild?.classList).toContain(className);
        });

        it('should set `size` class', () => {
            const size = 'm';
            const { container } = render(<PureInput size={size} />);

            expect(container.firstElementChild?.classList).toContain(size);
        });

        it('should set `block` class', () => {
            const { container } = render(<PureInput block={true} />);

            expect(container.firstElementChild?.classList).toContain('block');
        });
    });
});
