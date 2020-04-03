/**
 * Vendor
 */

import React from 'react';
import { render } from '@testing-library/react';

/**
 * Component
 */

import { Tag } from './index';

describe('Tag', () => {
    it('should match snapshot', () => {
        expect(render(<Tag />)).toMatchSnapshot();
    });
});
