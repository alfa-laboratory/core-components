/**
 * Vendor
 */

import React from 'react';
import { render } from '@testing-library/react';

/**
 * Component
 */

import { Divider } from './index';

describe('Divider', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<Divider />)).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` atribute', () => {
            const dataTestId = 'test-id';
            const { getByTestId } = render(<Divider dataTestId={dataTestId} />);

            expect(getByTestId(dataTestId).tagName).toBe('HR');
        });
    });

    describe('Classes tests', () => {
        it('should set `className` class to root', () => {
            const className = 'test-class';
            const { container } = render(<Divider className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<Divider />);

        expect(unmount).not.toThrowError();
    });
});
