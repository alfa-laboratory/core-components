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
    it('should render without problem', () => {
        expect(render(<Divider />)).toMatchSnapshot();
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
