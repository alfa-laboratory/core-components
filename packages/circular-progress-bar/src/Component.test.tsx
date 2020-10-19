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

            expect(getByTestId(testId)).toBeInTheDocument();
        });

        it('should use passed `value`', () => {
            const { container } = render(<CircularProgressBar value={72} />);

            expect(container.querySelector('.progressCircle')).toHaveAttribute(
                'stroke-dashoffset',
                '98.520',
            );
        });

        it('should use passed `title`', () => {
            const text = 'test-text';
            const { container } = render(<CircularProgressBar value={72} title={text} />);

            expect(container.querySelector('.title')).toHaveTextContent(text);
        });

        it('should `title = value` if `title = undefined`', () => {
            const value = 72;
            const { container } = render(<CircularProgressBar value={value} />);

            expect(container.querySelector('.title')).toHaveTextContent(`${value}`);
        });

        it('should use passed `subTitle`', () => {
            const text = 'test-text';
            const { container } = render(<CircularProgressBar value={72} subTitle={text} />);

            expect(container.querySelector('.subTitle')).toHaveTextContent(text);
        });

        it('should use only passed `children`', () => {
            const subTitle = 'test-subTitle';
            const text = 'test-text';
            const { container } = render(
                <CircularProgressBar value={72} subTitle={subTitle}>
                    {text}
                </CircularProgressBar>,
            );

            expect(container.querySelector('.label')).toHaveTextContent(text);
            expect(container.querySelector('.subTitle')).not.toBeInTheDocument();
        });
    });

    describe('Classes tests', () => {
        it('should use default `size`', () => {
            const { container } = render(<CircularProgressBar value={20} />);

            expect(container.firstElementChild).toHaveClass('m');
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
