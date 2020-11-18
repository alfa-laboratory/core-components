import React from 'react';
import { render } from '@testing-library/react';

import { Spinner } from './index';

const testId = 'spinner';

describe('Snapshots tests', () => {
    it('should display correctly', () => {
        const { container } = render(<Spinner />);

        expect(container).toMatchSnapshot();
    });
});

describe('Attributes tests', () => {
    it('should set data-test-id attribute', async () => {
        const className = 'custom';

        render(<Spinner className={className} dataTestId={testId} />);

        const spinnerContentWrap = document.querySelector(`.${className}`);

        const testIdAttr = spinnerContentWrap?.getAttribute('data-test-id');

        expect(testIdAttr).toBe(testId);
    });
});

describe('Render tests', () => {
    it('should unmount without errors', async () => {
        const { unmount } = render(<Spinner />);

        expect(unmount).not.toThrowError();
    });

    it('should have visible class if prop visible is true', async () => {
        const { getByTestId } = render(<Spinner dataTestId={testId} visible={true} />);

        expect(getByTestId(testId)).toHaveClass('visible');
    });
});
