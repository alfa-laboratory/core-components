import React from 'react';
import { render } from '@testing-library/react';
import { getMatchMedia } from './utils';
import { Mq } from './Component';

jest.mock('./utils', () => ({
    isPointerEventsSupported: jest.fn(() => true),
    getMatchMedia: jest.fn(() => ({
        addListener: jest.fn,
        removeListener: jest.fn,
        matches: false,
    })),
    releaseMatchMedia: jest.fn,
}));

function mockGetMatchMedia(result: boolean) {
    (getMatchMedia as jest.Mock).mockReturnValueOnce({
        addListener: jest.fn,
        removeListener: jest.fn,
        matches: result,
    });
}

describe('mq', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not mount children on conditions mismatch', () => {
        mockGetMatchMedia(false);

        const { container } = render(
            <Mq query='--small-only' touch={true}>
                Content
            </Mq>,
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('should mount with matching query and matching touch screen', () => {
        mockGetMatchMedia(true);

        const { container } = render(
            <Mq query='--small-only' touch={true}>
                Content
            </Mq>,
        );

        expect(container).toHaveTextContent('Content');
    });

    it('should mount with matching query and missing touch', () => {
        mockGetMatchMedia(true);

        const { container } = render(<Mq query='--small-only'>Content</Mq>);

        expect(container).toHaveTextContent('Content');
    });

    it('should mount with missing query and matching touch screen', () => {
        const { container } = render(<Mq touch={true}>Content</Mq>);

        expect(container).toHaveTextContent('Content');
    });

    it('should mount with missing query and missing touch', () => {
        const { container } = render(<Mq>Content</Mq>);

        expect(container).toHaveTextContent('Content');
    });

    it('should not mount with non-matching query', () => {
        const { container } = render(<Mq query='--non-matching-query'>Content</Mq>);

        expect(container).toBeEmptyDOMElement();
    });
});
