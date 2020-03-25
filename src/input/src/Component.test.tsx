/**
 * Vendor
 */

import React from 'react';
import { render } from '@testing-library/react';

/**
 * Component
 */

import { Input } from './index';

describe('Input', () => {
    it('should match snapshot', () => {
        expect(render(<Input />)).toMatchSnapshot();
    });
});
