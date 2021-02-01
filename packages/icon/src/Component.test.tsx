import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { Icon } from './index';

describe('Icon', () => {
    it('should uses a `name` prop and becomes a svg', async () => {
        const { container } = render(<Icon name='glyph_debt_m' />);

        await waitFor(() => expect(container.querySelector('svg')).not.toBe(null));
    });

    it('should use a color prop', async () => {
        const color = '#ccc';
        const { container } = render(<Icon name='glyph_debt_m' color={color} />);

        await waitFor(() => expect(container.firstElementChild).toHaveStyle(`color: ${color}`));
    });
});
