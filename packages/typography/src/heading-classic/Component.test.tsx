import React from 'react';
import { render } from '@testing-library/react';

import { colors } from '../colors';
import { HeadingClassic, HeadingClassicProps } from './index';

describe('HeadingClassic', () => {
    describe('Classes tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';

            const { container } = render(<HeadingClassic className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set class `large` as default view', () => {
            const { container } = render(<HeadingClassic />);

            expect(container.firstElementChild).toHaveClass('large');
        });

        it('should set class `bold` as default weight', () => {
            const { container } = render(<HeadingClassic />);

            expect(container.firstElementChild).toHaveClass('bold');
        });

        it('should set `view` class', () => {
            const views: Array<HeadingClassicProps['view']> = [
                'xlarge',
                'large',
                'normal',
                'small',
                'xsmall',
            ];

            views.forEach(view => {
                if (!view) return;

                const { container } = render(<HeadingClassic view={view} />);

                expect(container.firstElementChild).toHaveClass(view);
            });
        });

        it('should set `color` class', () => {
            colors.forEach(color => {
                const { container } = render(<HeadingClassic color={color} />);

                expect(container.firstElementChild).toHaveClass(color);
            });
        });

        it('should set `weight` class', () => {
            const weights: Array<HeadingClassicProps['weight']> = ['regular', 'medium', 'bold'];

            weights.forEach(weight => {
                if (!weight) return;

                const { container } = render(<HeadingClassic weight={weight} />);

                expect(container.firstElementChild).toHaveClass(weight);
            });
        });
    });

    describe('Attributes tests', () => {
        it('should set data-test-id attribute', () => {
            const dataTestId = 'heading-test-id';

            const { queryByTestId } = render(<HeadingClassic dataTestId={dataTestId} />);

            expect(queryByTestId(dataTestId)).toBeInTheDocument();
        });

        it('should set h2 tag by default', () => {
            const defaultHeadingClassicTag = 'H2';
            const { container } = render(<HeadingClassic />);

            expect(container.firstElementChild?.nodeName).toEqual(defaultHeadingClassicTag);
        });

        it('should set tag correcly', () => {
            const { container, rerender } = render(<HeadingClassic />);
            const tags: Array<HeadingClassicProps['tag']> = [
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'div',
            ];

            tags.forEach(tag => {
                if (!tag) return;

                const requiredHeadingClassicTag = tag.toUpperCase();

                rerender(<HeadingClassic tag={tag} />);

                expect(container.firstElementChild?.nodeName).toEqual(requiredHeadingClassicTag);
            });
        });
    });
});
