import React from 'react';
import { render } from '@testing-library/react';

import { HeadingClassic, HeadingClassicProps } from './index';

describe('Classes tests', () => {
    it('should set custom class', () => {
        const className = 'custom-class';

        const { container } = render(<HeadingClassic className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should set class `headlineLarge` as default view', () => {
        const { container } = render(<HeadingClassic />);

        expect(container.firstElementChild).toHaveClass('headlineLarge');
    });

    it('should set `view` class', () => {
        const views: Array<HeadingClassicProps['view']> = [
            'headline-xlarge',
            'headline-large',
            'headline-normal',
            'headline-small',
            'headline-xsmall',
        ];
        views.forEach(view => {
            if (!view) return;

            const className = view.replace(/-+(.)/g, (_, chr) => chr.toUpperCase());

            const { container } = render(<HeadingClassic view={view} />);

            expect(container.firstElementChild).toHaveClass(className);
        });
    });
});

describe('Attributes tests', () => {
    it('should set data-test-id attribute', () => {
        const dataTestId = 'heading-test-id';

        const { container } = render(<HeadingClassic dataTestId={dataTestId} />);

        const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

        expect(container.firstElementChild?.getAttribute('data-test-id')).toBe(testIdAttr);
    });

    it('should have a default level', () => {
        const defaultLevel: HeadingClassicProps['level'] = 2;
        const defaultHeadingTag = `H${defaultLevel}`;
        const { container } = render(<HeadingClassic />);

        expect(container.firstElementChild?.nodeName).toEqual(defaultHeadingTag);
    });

    it('should use a level prop', () => {
        const { container, rerender } = render(<HeadingClassic />);
        const levels: Array<HeadingClassicProps['level']> = [1, 2, 3, 4, 5];

        levels.forEach(requiredLevel => {
            const requiredHeadingTag = `H${requiredLevel}`;

            rerender(<HeadingClassic level={requiredLevel} />);

            expect(container.firstElementChild?.nodeName).toEqual(requiredHeadingTag);
        });
    });
});
