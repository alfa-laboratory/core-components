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

        it('should set class `styrene-large` as default view', () => {
            const { container } = render(<Heading />);

            expect(container.firstElementChild).toHaveClass('styrene-large');
        });

        it('should set class `medium` as default weight', () => {
            const { container } = render(<Heading />);

            expect(container.firstElementChild).toHaveClass('medium');
        });

        it('should set `view` class according to the font', () => {
            const fonts: Array<HeadingProps['font']> = ['styrene', 'system'];

            const views: Array<HeadingProps['view']> = [
                'xlarge',
                'large',
                'normal',
                'small',
                'xsmall',
            ];

            fonts.forEach(font => {
                if (!font) return;

                views.forEach(view => {
                    if (!view) return;

                    const { container } = render(<Heading view={view} font={font} />);

                    expect(container.firstElementChild).toHaveClass(`${font}-${view}`);
                });
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

            const { queryByTestId } = render(<Heading dataTestId={dataTestId} />);

            expect(queryByTestId(dataTestId)).toBeInTheDocument();
        });

        it('should set h2 tag by default', () => {
            const defaultHeadingTag = 'H2';
            const { container } = render(<Heading />);

            expect(container.firstElementChild?.nodeName).toEqual(defaultHeadingTag);
        });

        it('should set tag correcly', () => {
            const { container, rerender } = render(<Heading />);
            const tags: Array<HeadingProps['tag']> = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'];

            tags.forEach(tag => {
                if (!tag) return;

                const requiredHeadingTag = tag.toUpperCase();

                rerender(<Heading tag={tag} />);

                expect(container.firstElementChild?.nodeName).toEqual(requiredHeadingTag);
            });
        });
    });
});
