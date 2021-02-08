import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { CDNIcon } from './index';

describe('CDNIcon', () => {
    it('should use the `name` prop and becomes a svg', async () => {
        const { container } = render(<CDNIcon name='glyph_debt_m' />);
        await waitFor(() => expect(container.querySelector('svg')).not.toBe(null));
    });

    it('should use the color prop', async () => {
        const color = '#ccc';
        const { container } = render(<CDNIcon name='glyph_debt_m' color={color} />);
        await waitFor(() => expect(container.firstElementChild).toHaveStyle(`color: ${color}`));
    });
});
