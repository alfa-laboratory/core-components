import React from 'react';
import { render } from '@testing-library/react';

import { colors } from '../colors';
import { Heading, HeadingProps } from './index';

describe('Heading', () => {
    describe('Classes tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';

            const { container } = render(<Heading className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set class `large` as default view', () => {
            const { container } = render(<Heading />);

            expect(container.firstElementChild).toHaveClass('large');
        });

        it('should set class `medium` as default weight', () => {
            const { container } = render(<Heading />);

            expect(container.firstElementChild).toHaveClass('medium');
        });

        it('should set `view` class', () => {
            const views: Array<HeadingProps['view']> = [
                'xlarge',
                'large',
                'normal',
                'small',
                'xsmall',
            ];

            views.forEach(view => {
                if (!view) return;

                const { container } = render(<Heading view={view} />);

                expect(container.firstElementChild).toHaveClass(view);
            });
        });

        it('should set `color` class', () => {
            colors.forEach(color => {
                const { container } = render(<Heading color={color} />);

                expect(container.firstElementChild).toHaveClass(color);
            });
        });

        it('should set `weight` class', () => {
            const weights: Array<HeadingProps['weight']> = ['regular', 'medium', 'bold'];

            weights.forEach(weight => {
                if (!weight) return;

                const { container } = render(<Heading weight={weight} />);

                expect(container.firstElementChild).toHaveClass(weight);
            });
        });
    });

    describe('Attributes tests', () => {
        it('should set data-test-id attribute', () => {
            const dataTestId = 'heading-test-id';

            const { container } = render(<Heading dataTestId={dataTestId} />);

            const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

            expect(container.firstElementChild?.getAttribute('data-test-id')).toBe(testIdAttr);
        });

        it('should set h2 tag by default', () => {
            const defaultHeadingTag = 'H2';
            const { container } = render(<Heading />);

            expect(container.firstElementChild?.nodeName).toEqual(defaultHeadingTag);
        });

        it('should set tag correcly', () => {
            const { container, rerender } = render(<Heading />);
            const tags: Array<HeadingProps['tag']> = ['h1', 'h2', 'h3', 'h4', 'h5', 'div'];

            tags.forEach(tag => {
                if (!tag) return;

                const requiredHeadingTag = tag.toUpperCase();

                rerender(<Heading tag={tag} />);

                expect(container.firstElementChild?.nodeName).toEqual(requiredHeadingTag);
            });
        });
    });
});
