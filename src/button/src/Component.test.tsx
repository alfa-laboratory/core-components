/**
 * Vendor
 */

import React from 'react';
import { render } from '@testing-library/react';

/**
 * Component
 */

import { Button } from './index';

describe('Button', () => {
    it('should render without problem', () => {
        expect(render(<Button />)).toMatchSnapshot();
    });

    it('should use a className prop', () => {
        const className = 'short';
        const { container } = render(<Button className={className} />);

        expect(container.firstElementChild?.classList).toContain(className);
    });
});
