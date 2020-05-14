import React from 'react';
import { render } from '@testing-library/react';

import { Select } from './index';

describe('Snapshots tests', () => {
    it('should match snapshot', () => {
        expect(render(<Select items={[]} />)).toMatchSnapshot();
    });
});
