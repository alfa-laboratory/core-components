import React from 'react';
import { render, waitFor, waitForElement, act } from '@testing-library/react';

import axiosMock from'axios';
import axios from'axios';
import { Icon } from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Icon', () => {
    it('should uses a `name` prop and becomes a svg', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { greeting: 'hello there' } });
        const { container } = render(<Icon name='glyph_debt_m' />);
        const countSpan = await waitFor(() => expect(container.querySelector('svg')).not.toBe(null));
    });
    it('', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { greeting: 'hello there' } });
        const { container } = render(<Icon name="fake-fake-fake"/>);
        const countSpan = await waitFor(() => expect(container.querySelector('svg')).toHaveClass('star'));
    });
    it('should use a color prop', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { greeting: 'hello there' } });
        const color = '#ccc';
        const { container } = render(<Icon name='glyph_debt_m' color={color} />);
        const countSpan = await waitFor(() => expect(container.firstElementChild).toHaveStyle(`color: ${color}`));
    });
});
