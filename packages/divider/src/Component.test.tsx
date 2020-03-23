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
    it('should have a default test identifier', () => {
        const { container } = render(<Divider />);

        expect(container.firstElementChild).toHaveAttribute('data-test-id');
    });

    it('should use a dataTestId prop', () => {
        const testId = 'header-divider';
        const { getByTestId } = render(<Divider dataTestId={testId} />);

        expect(getByTestId(testId)).toBeTruthy();
    });

    it('should use a className prop', () => {
        const className = 'short';
        const { container } = render(<Divider className={className} />);

        expect(container.firstElementChild?.classList).toContain(className);
    });
});
