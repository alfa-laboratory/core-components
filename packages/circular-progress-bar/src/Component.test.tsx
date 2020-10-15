import React from 'react';
import { render } from '@testing-library/react';

import { CircularProgressBar } from './Component';

describe('ProgressBar', () => {
    describe('Snapshots tests', () => {
        it('should match snapshot', () => {
            const { container } = render(<CircularProgressBar value={20} />);
            expect(container).toMatchSnapshot();
        });

        it('should match with view snapshot', () => {
            const { container } = render(<CircularProgressBar value={20} view='negative' />);
            expect(container).toMatchSnapshot();
        });
    });

    describe('Attributes tests', () => {
        it('should set `data-test-id` attribute', () => {
            const testId = 'test-id';
            const { getByTestId } = render(<CircularProgressBar value={20} dataTestId={testId} />);

            expect(getByTestId(testId)).toHaveAttribute('data-test-id', testId);
        });

        it('should use passed `value`', () => {
            const { container } = render(<CircularProgressBar value={72} />);

            expect(container.querySelector('.progressCircle')).toHaveAttribute(
                'stroke-dasharray',
                '244.29024474314232, 1000',
            );
        });

        it('should use passed `headLine`', () => {
            const text = 'test-text';
            const { container } = render(<CircularProgressBar value={72} headLine={text} />);

            expect(container.querySelector('.headLine')).toHaveTextContent(text);
        });

        it('should use passed `caption`', () => {
            const text = 'test-text';
            const { container } = render(<CircularProgressBar value={72} caption={text} />);

            expect(container.querySelector('.caption')).toHaveTextContent(text);
        });

        it('should use only passed `children`', () => {
            const caption = 'test-caption';
            const text = 'test-text';
            const { container } = render(
                <CircularProgressBar value={72} caption={caption}>
                    {text}
                </CircularProgressBar>,
            );

            expect(container.querySelector('.label')).toHaveTextContent(text);
            expect(container.querySelector('.caption')).toBe(null);
        });
    });

    describe('Classes tests', () => {
        it('should use default `size`', () => {
            const { container } = render(<CircularProgressBar value={20} />);

            expect(container.firstElementChild).toHaveClass('s');
        });

        it('should use passed `size`', () => {
            const { container } = render(<CircularProgressBar value={20} size='l' />);

            expect(container.firstElementChild).toHaveClass('l');
        });

        it('should set `className` class to root', () => {
            const className = 'test-class';
            const { container } = render(<CircularProgressBar value={20} className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set default color class', () => {
            const { container } = render(<CircularProgressBar value={20} />);

            expect(container.querySelector('.progressCircle')).toHaveClass('positive');
        });

        it('should set color class', () => {
            const { container } = render(<CircularProgressBar value={20} view='negative' />);

            expect(container.querySelector('.progressCircle')).toHaveClass('negative');
        });
    });

    it('should unmount without errors', () => {
        const { unmount } = render(<CircularProgressBar value={20} />);

        expect(unmount).not.toThrowError();
    });
});
