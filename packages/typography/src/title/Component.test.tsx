import React from 'react';
import { render } from '@testing-library/react';

import { colors } from '../colors';
import { Title, TitleProps } from './index';

describe('Title', () => {
    describe('Classes tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';

            const { container } = render(<Title tag='h1' className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set class `styrene-medium` as default view', () => {
            const { container } = render(<Title tag='h1' />);

            expect(container.firstElementChild).toHaveClass('styrene-medium');
        });

        it('should set class `medium` as default weight', () => {
            const { container } = render(<Title tag='h1' />);

            expect(container.firstElementChild).toHaveClass('medium');
        });

        it('should set `view` class according to the font', () => {
            const fonts: Array<TitleProps['font']> = ['styrene', 'system'];

            const views: Array<TitleProps['view']> = [
                'xlarge',
                'large',
                'medium',
                'small',
                'xsmall',
            ];

            fonts.forEach(font => {
                if (!font) return;

                views.forEach(view => {
                    if (!view) return;

                    const { container } = render(<Title tag='h1' view={view} font={font} />);

                    expect(container.firstElementChild).toHaveClass(`${font}-${view}`);
                });
            });
        });

        it('should set `color` class', () => {
            colors.forEach(color => {
                const { container } = render(<Title tag='h1' color={color} />);

                expect(container.firstElementChild).toHaveClass(color);
            });
        });

        it('should set `weight` class', () => {
            const weights: Array<TitleProps['weight']> = ['regular', 'medium', 'bold'];

            weights.forEach(weight => {
                if (!weight) return;

                const { container } = render(<Title tag='h1' weight={weight} />);

                expect(container.firstElementChild).toHaveClass(weight);
            });
        });
    });

    describe('Attributes tests', () => {
        it('should set data-test-id attribute', () => {
            const dataTestId = 'title-test-id';

            const { queryByTestId } = render(<Title tag='h1' dataTestId={dataTestId} />);

            expect(queryByTestId(dataTestId)).toBeInTheDocument();
        });

        it('should set tag correcly', () => {
            const { container, rerender } = render(<Title tag='h1' />);
            const tags: Array<TitleProps['tag']> = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'];

            tags.forEach(tag => {
                if (!tag) return;

                const requiredTitleTag = tag.toUpperCase();

                rerender(<Title tag={tag} />);

                expect(container.firstElementChild?.nodeName).toEqual(requiredTitleTag);
            });
        });
    });
});
