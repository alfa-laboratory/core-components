import React from 'react';
import { render, waitFor } from '@testing-library/react';

import axios from'axios';
import { Icon } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Icon', () => {
    it('should use the `name` prop and becomes a svg', async () => {
        mockedAxios.get.mockResolvedValueOnce('');
        const { container } = render(<Icon name='glyph_debt_m' />);
        await waitFor(() => expect(container.querySelector('svg')).not.toBe(null));
    });
    it('should pass an invalid value to the `name` prop', async () => {
        mockedAxios.get.mockResolvedValueOnce('');
        const { container } = render(<Icon name="fake-fake-fake"/>);
        await waitFor(() => expect(container.querySelector('svg')).toHaveClass('star'));
    });
    it('should use the color prop', async () => {
        mockedAxios.get.mockResolvedValueOnce('');
        const color = '#ccc';
        const { container } = render(<Icon name='glyph_debt_m' color={color} />);
        await waitFor(() => expect(container.firstElementChild).toHaveStyle(`color: ${color}`));
    });
});
