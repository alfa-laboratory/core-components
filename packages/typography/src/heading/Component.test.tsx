import React from 'react';
import { render } from '@testing-library/react';

import { Heading, HeadingProps } from './index';

describe('Classes tests', () => {
    it('should set custom class', () => {
        const className = 'custom-class';

        const { container } = render(<Heading className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should set class `headlineLarge` as default view', () => {
        const { container } = render(<Heading />);

        expect(container.firstElementChild).toHaveClass('headlineLarge');
    });

    it('should set `view` class', () => {
        const views: Array<HeadingProps['view']> = [
            'headline-xlarge',
            'headline-large',
            'headline-normal',
            'headline-small',
            'headline-xsmall',
            'promo-xlarge',
            'promo-large',
            'promo-normal',
            'promo-small',
            'promo-xsmall',
        ];
        views.forEach(view => {
            if (!view) return;

            const className = view.replace(/-+(.)/g, (_, chr) => chr.toUpperCase());

            const { container } = render(<Heading view={view} />);

            expect(container.firstElementChild).toHaveClass(className);
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

    it('should have a default level', () => {
        const defaultLevel: HeadingProps['level'] = 2;
        const defaultHeadingTag = `H${defaultLevel}`;
        const { container } = render(<Heading />);

        expect(container.firstElementChild?.nodeName).toEqual(defaultHeadingTag);
    });

    it('should use a level prop', () => {
        const { container, rerender } = render(<Heading />);
        const levels: Array<HeadingProps['level']> = [1, 2, 3, 4, 5];

        levels.forEach(requiredLevel => {
            const requiredHeadingTag = `H${requiredLevel}`;

            rerender(<Heading level={requiredLevel} />);

            expect(container.firstElementChild?.nodeName).toEqual(requiredHeadingTag);
        });
    });
});
