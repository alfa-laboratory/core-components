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
    it('should match snapshot', () => {
        expect(render(<Divider />)).toMatchSnapshot();
    });

    it('should set `data-test-id` atribute', () => {
        const dataTestId = 'test-id';
        const { getByTestId } = render(<Divider dataTestId={dataTestId} />);

        expect(getByTestId(dataTestId)).toBeTruthy();
    });

    describe('classNames', () => {
        it('should set `className` class to root', () => {
            const className = 'test-class';
            const { container } = render(<Divider className={className} />);

            expect(container.firstElementChild?.classList).toContain(className);
        });
    });
});
