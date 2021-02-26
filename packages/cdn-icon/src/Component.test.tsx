import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { CDNIcon } from './index';

describe('CDNIcon', () => {
    /*
     * TODO падает на гитхабе
     * it('should use the `name` prop and becomes a svg', async () => {
     *     const { container } = render(<CDNIcon name='glyph_debt_m' />);
     *     await waitFor(() => expect(container.querySelector('svg')).not.toBe(null));
     * });
     */

    it('should pass an invalid value to the `name` prop', async () => {
        const { container } = render(<CDNIcon name='fake-fake-fake' />);
        await waitFor(() => expect(container.querySelector('span')).toHaveTextContent(''));
    });

    it('should use the color prop', async () => {
        const color = '#ccc';
        const { container } = render(<CDNIcon name='glyph_debt_m' color={color} />);
        await waitFor(() => expect(container.firstElementChild).toHaveStyle(`color: ${color}`));
    });
});
