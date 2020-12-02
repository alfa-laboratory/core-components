import React from 'react';
import { render } from '@testing-library/react';
import { useMatchMedia } from './useMatchMedia';
import { getMatchMedia } from './utils';

jest.mock('./utils');

function mockGetMatchMedia(matches: boolean) {
    (getMatchMedia as jest.Mock).mockReturnValue({
        addListener: jest.fn,
        removeListener: jest.fn,
        matches,
    });
}

describe('useMatchMedia', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(React, 'useEffect');
    });

    it('should try to reconcile each time', () => {
        mockGetMatchMedia(false);

        const Example = () => {
            const [matches] = useMatchMedia('--small-only');
            return <div>{JSON.stringify(matches)}</div>;
        };

        const { unmount, rerender, container } = render(<Example />);

        expect(container.firstElementChild).toHaveTextContent('false');
        expect(React.useEffect).toHaveBeenCalledTimes(1);

        unmount();
        rerender(<Example />);

        expect(container.firstElementChild).toHaveTextContent('false');
        expect(React.useEffect).toHaveBeenCalledTimes(2);
    });

    it('should be able to change the query dynamically', () => {
        mockGetMatchMedia(false);

        const Example = ({ query }: { query: string }) => {
            const [matches] = useMatchMedia(query);
            return <div>{JSON.stringify(matches)}</div>;
        };

        const { rerender, container } = render(<Example query='--small-only' />);

        expect(container.firstElementChild).toHaveTextContent('false');
        expect(React.useEffect).toHaveBeenCalledTimes(1);

        mockGetMatchMedia(true);

        rerender(<Example query='--desktop-m' />);
        expect(container.firstElementChild).toHaveTextContent('true');

        expect(React.useEffect).toHaveBeenCalledTimes(3);
    });
});
