import React from 'react';
import { render } from '@testing-library/react';

import { colors } from '../colors';
import { Text, TextProps } from './index';

describe('Text', () => {
    describe('Classes tests', () => {
        it('should set custom class', () => {
            const className = 'custom-class';

            const { container } = render(<Text className={className} />);

            expect(container.firstElementChild).toHaveClass(className);
        });

        it('should set class `primary-medium` as default view', () => {
            const { container } = render(<Text />);

            expect(container.firstElementChild).toHaveClass('primary-medium');
        });

        it('should set class `regular` as default weight', () => {
            const { container } = render(<Text />);

            expect(container.firstElementChild).toHaveClass('regular');
        });

        it('should set `view` class', () => {
            const views: Array<TextProps['view']> = [
                'primary-large',
                'primary-medium',
                'primary-small',
                'secondary-large',
                'secondary-medium',
                'secondary-small',
                'component',
                'caps',
            ];

            views.forEach(view => {
                if (!view) return;

                const { container } = render(<Text view={view} />);

                expect(container.firstElementChild).toHaveClass(view);
            });
        });

        it('should set `color` class', () => {
            colors.forEach(color => {
                const { container } = render(<Text color={color} />);

                expect(container.firstElementChild).toHaveClass(color);
            });
        });

        it('should set `weight` class', () => {
            const weights: Array<TextProps['weight']> = ['regular', 'medium', 'bold'];

            weights.forEach(weight => {
                if (!weight) return;

                const { container } = render(<Text weight={weight} />);

                expect(container.firstElementChild).toHaveClass(weight);
            });
        });

        it('should set `monospace` class if prop `monospaceNumbers` is present', () => {
            const { container } = render(<Text monospaceNumbers={true}>12345</Text>);

            expect(container.firstElementChild).toHaveClass('monospace');
        });
    });

    describe('Attributes tests', () => {
        it('should set data-test-id attribute', () => {
            const dataTestId = 'title-test-id';

            const { queryByTestId } = render(<Text dataTestId={dataTestId} />);

            expect(queryByTestId(dataTestId)).toBeInTheDocument();
        });

        it('should set span tag by default', () => {
            const defaultTextTag = 'SPAN';
            const { container } = render(<Text />);

            expect(container.firstElementChild?.nodeName).toEqual(defaultTextTag);
        });

        it('should set tag correcly', () => {
            const { container, rerender } = render(<Text />);
            const tags: Array<TextProps['tag']> = ['div', 'p', 'span'];

            tags.forEach(tag => {
                if (!tag) return;

                const requiredTextTag = tag.toUpperCase();

                rerender(<Text tag={tag} />);

                expect(container.firstElementChild?.nodeName).toEqual(requiredTextTag);
            });
        });
    });
});
