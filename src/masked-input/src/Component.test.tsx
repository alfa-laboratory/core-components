/**
 * Vendor
 */

import React from 'react';
import { render } from '@testing-library/react';

/**
 * Component
 */

import { MaskedInput } from './index';

describe('Input', () => {
    it('should match snapshot', () => {
        expect(render(<MaskedInput />)).toMatchSnapshot();
    });
});
