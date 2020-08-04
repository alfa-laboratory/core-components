import React from 'react';
import { render } from '@testing-library/react';

import { Text, TextProps } from './index';

describe('Classes tests', () => {
    it('should set custom class', () => {
        const className = 'custom-class';

        const { container } = render(<Text className={className} />);

        expect(container.firstElementChild).toHaveClass(className);
    });

    it('should set `view` class', () => {
        const views: Array<TextProps['view']> = [
            'paragraph-primary-large',
            'paragraph-primary-normal',
            'paragraph-primary-small',
            'paragraph-secondary-large',
            'paragraph-secondary-normal',
            'paragraph-secondary-small',
            'paragraph-component',
            'paragraph-caps',
            'accent-primary-large',
            'accent-primary-normal',
            'accent-primary-small',
            'accent-secondary-large',
            'accent-secondary-normal',
            'accent-secondary-small',
            'accent-component',
            'accent-caps',
            'action-primary-large',
            'action-primary-normal',
            'action-primary-small',
            'action-secondary-large',
            'action-secondary-normal',
            'action-secondary-small',
            'key-xlarge',
            'key-large',
            'key-normal',
            'key-small',
            'key-xsmall',
            'legacy-styrene-normal',
            'legacy-primary-small',
        ];
        views.forEach(view => {
            if (!view) return;

            const className = view.replace(/-+(.)/g, (_, chr) => chr.toUpperCase());

            const { container } = render(<Text view={view} />);

            expect(container.firstElementChild).toHaveClass(className);
        });
    });

    it('should set `type` class', () => {
        const types: Array<TextProps['type']> = ['secondary', 'negative', 'positive', 'attention'];
        types.forEach(type => {
            if (!type) return;

            const { container } = render(<Text type={type} />);

            expect(container.firstElementChild).toHaveClass(type);
        });
    });
});

describe('Attributes tests', () => {
    it('should set data-test-id attribute', () => {
        const dataTestId = 'text-test-id';

        const { container } = render(<Text dataTestId={dataTestId} />);

        const testIdAttr = container.firstElementChild?.getAttribute('data-test-id');

        expect(container.firstElementChild?.getAttribute('data-test-id')).toBe(testIdAttr);
    });

    it('should have a default node', () => {
        const defaultTextTag = 'span';
        const { container } = render(<Text />);

        expect(container.firstElementChild?.nodeName).toEqual(defaultTextTag.toUpperCase());
    });

    it('should set `tag` node', () => {
        const tag = 'p';
        const { container } = render(<Text tag={tag} />);

        expect(container.firstElementChild?.nodeName).toEqual(tag.toUpperCase());
    });
});
