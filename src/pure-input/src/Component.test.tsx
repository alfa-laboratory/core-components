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
});
