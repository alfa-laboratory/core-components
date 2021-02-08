import React from 'react';
import { render, waitFor } from '@testing-library/react';

import axios from 'axios';
import { CDNIcon } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CDNIcon', () => {
    it('should use the `name` prop and becomes a svg', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: '<svg />' });
        const { container } = render(<CDNIcon name='glyph_debt_m' />);
        await waitFor(() => expect(container.querySelector('svg')).not.toBe(null));
    });

    it('should pass an invalid value to the `name` prop', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: '' });
        const { container } = render(<CDNIcon name='fake-fake-fake' />);
        await waitFor(() => expect(container.querySelector('span')).toHaveTextContent(''));
    });

    it('should use the color prop', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: '<svg />' });
        const color = '#ccc';
        const { container } = render(<CDNIcon name='glyph_debt_m' color={color} />);
        await waitFor(() => expect(container.firstElementChild).toHaveStyle(`color: ${color}`));
    });
});
