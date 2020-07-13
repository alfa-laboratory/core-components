import React from 'react';
import { render } from '@testing-library/react';

import { ProgressBar } from './Component';

describe('ProgressBar', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            expect(render(<ProgressBar />)).toMatchSnapshot();
        });

        it('should match with value snapshot', () => {
            expect(render(<ProgressBar value={32} />)).toMatchSnapshot();
        });

        it('should match with view snapshot', () => {
            expect(render(<ProgressBar view='negative' />)).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` attribute', () => {
            const testId = 'test-id';
            const { getByTestId } = render(<ProgressBar dataTestId={testId} />);

            expect(getByTestId(testId)).toHaveAttribute('data-test-id', testId);
        });
    });

    it('should use passed `value`', () => {
        const value = 72.45;
        const { container } = render(<ProgressBar value={value} />);

        expect(container.querySelector('.filled')).toHaveStyle('transform: translateX(-27.55%)');
    });

    describe('Classes tests', () => {
        it('should set `className` class to root', () => {
            const className = 'test-class';
            const { container } = render(<ProgressBar className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set default color class', () => {
            const { container } = render(<ProgressBar />);

            expect(container.querySelector('.filled')).toHaveClass('positive');
        });

        it('should set color class', () => {
            const { container } = render(<ProgressBar view='negative' />);

            expect(container.querySelector('.filled')).toHaveClass('negative');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<ProgressBar />);

        expect(unmount).not.toThrowError();
    });
});
