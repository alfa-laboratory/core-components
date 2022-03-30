import React from 'react';
import { render } from '@testing-library/react';

import { HatchingProgressBar } from './Component';

describe('HatchingProgressBar', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(<HatchingProgressBar hatchValue={40} value={20} />);
            expect(container).toMatchSnapshot();
        });

        it('should match with view snapshot', () => {
            const { container } = render(
                <HatchingProgressBar value={20} hatchValue={40} view='negative' />,
            );
            expect(container).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` attribute', () => {
            const testId = 'test-id';
            const { getByTestId } = render(
                <HatchingProgressBar value={20} hatchValue={40} dataTestId={testId} />,
            );

            expect(getByTestId(testId)).toHaveAttribute('data-test-id', testId);
        });
    });

    it('should use passed `value`', () => {
        const value = 72;
        const { container } = render(<HatchingProgressBar value={value} hatchValue={80} />);

        expect(container.querySelector('.filled')).toHaveStyle('transform: translateX(-28%)');
    });

    it('should use passed `hatchValue`', () => {
        const value = 72;
        const { container } = render(<HatchingProgressBar value={value} hatchValue={80} />);

        expect(container.querySelector('.hatch')).toHaveStyle('transform: translateX(-20%)');
    });

    describe('Classes tests', () => {
        it('should set `className` class to root', () => {
            const className = 'test-class';
            const { container } = render(
                <HatchingProgressBar value={20} hatchValue={40} className={className} />,
            );

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set default color class', () => {
            const { container } = render(<HatchingProgressBar value={20} hatchValue={40} />);

            expect(container.querySelector('.filled')).toHaveClass('positive');
        });

        it('should set color class', () => {
            const { container } = render(
                <HatchingProgressBar value={20} hatchValue={40} view='negative' />,
            );

            expect(container.querySelector('.filled')).toHaveClass('negative');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<HatchingProgressBar value={20} hatchValue={40} />);

        expect(unmount).not.toThrowError();
    });
});
