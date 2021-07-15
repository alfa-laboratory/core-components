import React from 'react';
import { render } from '@testing-library/react';

import { SteppedProgressBar } from './Component';

const defaultProps = {
    step: 7,
    maxStep: 8,
};

describe('SteppedProgressBar | common tests', () => {
    it('should set `data-test-id` attribute', () => {
        const dataTestId = 'test-id';
        const { queryByTestId } = render(
            <SteppedProgressBar {...defaultProps} dataTestId={dataTestId} />,
        );

        expect(queryByTestId(dataTestId)).toBeInTheDocument();
    });

    it('should set `className` class', () => {
        const className = 'test-class';
        const { container } = render(
            <SteppedProgressBar {...defaultProps} className={className} />,
        );

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<SteppedProgressBar {...defaultProps} />);

        expect(unmount).not.toThrowError();
    });
});
